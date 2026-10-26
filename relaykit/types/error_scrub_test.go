package types

import (
	"errors"
	"net/http"
	"strings"
	"testing"
)

func TestScrubProviderLinks(t *testing.T) {
	cases := []struct{ in, notWant string }{
		{"rate limit, see https://platform.openai.com/account/rate-limits now", "platform.openai.com"},
		{"contact https://t.me/provider_support for help", "t.me"},
		{"contact t.me/provider_support for help", "t.me"},
		{"ping @iishko on telegram", "@iishko"},
		{"visit https://example.com and then email us", "example.com"},
	}
	for _, tc := range cases {
		got := ScrubProviderLinks(tc.in)
		if strings.Contains(got, tc.notWant) {
			t.Errorf("ScrubProviderLinks(%q) = %q, still contains %q", tc.in, got, tc.notWant)
		}
	}
	if got := ScrubProviderLinks("insufficient quota"); got != "insufficient quota" {
		t.Errorf("plain message must pass through unchanged, got %q", got)
	}
	if got := ScrubProviderLinks(""); got != "" {
		t.Errorf("empty message must stay empty, got %q", got)
	}
}

func TestToOpenAIErrorScrubsLinks(t *testing.T) {
	e := NewErrorWithStatusCode(
		errors.New("billing sync failed, see https://t.me/provider_support or ping @iishko"),
		ErrorCodeInvalidApiType,
		http.StatusBadRequest,
	)
	out := e.ToOpenAIError()
	for _, leak := range []string{"t.me", "@iishko", "http"} {
		if strings.Contains(out.Message, leak) {
			t.Errorf("ToOpenAIError message leaks %q: %q", leak, out.Message)
		}
	}
}

func TestClientSafeErrorMessageMasksUpstream(t *testing.T) {
	upstream := NewOpenAIError(errors.New("openai rate limit, visit https://platform.openai.com"), ErrorCode("rate_limit_exceeded"), http.StatusTooManyRequests)
	if got := ClientSafeErrorMessage(upstream); got != UpstreamMaskedMessage {
		t.Errorf("upstream error must collapse to generic message, got %q", got)
	}
	internal := NewError(errors.New("insufficient quota for user"), ErrorCodeInsufficientUserQuota)
	if got := ClientSafeErrorMessage(internal); !strings.Contains(got, "insufficient quota") {
		t.Errorf("internal error must keep its meaning, got %q", got)
	}
}
