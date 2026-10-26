/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { beforeEach, describe, expect, test } from 'vitest'

import { toIntlLocale, type InterfaceLanguageCode } from '@/i18n/languages'
import {
  DEFAULT_CURRENCY_CONFIG,
  useSystemConfigStore,
} from '@/stores/system-config-store'

import {
  formatCurrencyFromUSD,
  formatLocalCurrencyAmount,
  formatQuotaWithCurrency,
  type CurrencyFormatOptions,
} from '../currency'

const SUMMARY_FORMAT_OPTIONS = {
  minimumFractionDigits: 2,
  digitsLarge: 2,
  digitsSmall: 2,
  abbreviate: false,
  locale: 'en-US',
} as const satisfies CurrencyFormatOptions

const CUSTOM_LOCALE_EXPECTATIONS: Record<InterfaceLanguageCode, string> = {
  zhCN: '€\u00A0200.00',
  en: '€\u00A0200.00',
  fr: '€\u00A0200,00',
  ru: '€\u00A0200,00',
  ja: '€\u00A0200.00',
  vi: '€\u00A0200,00',
  zhTW: '€\u00A0200.00',
}

function resetCurrencyConfig(): void {
  useSystemConfigStore
    .getState()
    .setConfig({ currency: { ...DEFAULT_CURRENCY_CONFIG } })
}

describe('currency formatting', () => {
  beforeEach(resetCurrencyConfig)

  test.each([
    { quota: 100_000_000, expected: '$200.00', kind: 'whole' },
    { quota: 100_250_000, expected: '$200.50', kind: 'decimal' },
  ])(
    'formats a $kind raw quota amount with two fraction digits',
    ({ quota, expected }) => {
      expect(formatQuotaWithCurrency(quota, SUMMARY_FORMAT_OPTIONS)).toBe(
        expected
      )
    }
  )

  test.each([
    { amount: 200, expected: '$200' },
    { amount: 200.5, expected: '$200.5' },
  ])(
    'keeps the default minimum at zero for $amount',
    ({ amount, expected }) => {
      expect(
        formatCurrencyFromUSD(amount, {
          abbreviate: false,
          locale: 'en-US',
        })
      ).toBe(expected)
    }
  )

  test('applies minimum digits when the currency symbol is hidden', () => {
    expect(
      formatCurrencyFromUSD(200, {
        ...SUMMARY_FORMAT_OPTIONS,
        showSymbol: false,
      })
    ).toBe('200.00')
  })

  test('clamps minimum digits to the computed maximum', () => {
    expect(
      formatCurrencyFromUSD(200, {
        ...SUMMARY_FORMAT_OPTIONS,
        minimumFractionDigits: 8,
      })
    ).toBe('$200.00')
  })

  test('clamps minimum digits to the compact maximum', () => {
    expect(
      formatCurrencyFromUSD(200_000, {
        minimumFractionDigits: 2,
        compact: true,
        locale: 'en-US',
      })
    ).toBe('$200.0K')
  })

  test('joins a custom symbol and amount with a non-breaking space', () => {
    useSystemConfigStore.getState().setConfig({
      currency: {
        ...DEFAULT_CURRENCY_CONFIG,
        quotaDisplayType: 'CUSTOM',
        customCurrencySymbol: '€',
      },
    })

    expect(formatQuotaWithCurrency(100_000_000, SUMMARY_FORMAT_OPTIONS)).toBe(
      '€\u00A0200.00'
    )
  })

  test('does not force fraction digits onto token displays', () => {
    useSystemConfigStore.getState().setConfig({
      currency: {
        ...DEFAULT_CURRENCY_CONFIG,
        quotaDisplayType: 'TOKENS',
      },
    })

    expect(formatCurrencyFromUSD(200, SUMMARY_FORMAT_OPTIONS)).toBe('100000000')
  })

  test.each(
    Object.entries(CUSTOM_LOCALE_EXPECTATIONS) as [
      InterfaceLanguageCode,
      string,
    ][]
  )('formats %s through its Intl locale', (language, expected) => {
    useSystemConfigStore.getState().setConfig({
      currency: {
        ...DEFAULT_CURRENCY_CONFIG,
        quotaDisplayType: 'CUSTOM',
        customCurrencySymbol: '€',
      },
    })

    expect(
      formatCurrencyFromUSD(200, {
        ...SUMMARY_FORMAT_OPTIONS,
        locale: toIntlLocale(language),
      })
    ).toBe(expected)
  })

  test('falls back to the runtime locale for an invalid interface language', () => {
    const invalidLocale = toIntlLocale('not_a_locale')
    expect(invalidLocale).toBeUndefined()

    expect(
      formatLocalCurrencyAmount(200, {
        ...SUMMARY_FORMAT_OPTIONS,
        locale: invalidLocale,
      })
    ).toBe(
      formatLocalCurrencyAmount(200, {
        ...SUMMARY_FORMAT_OPTIONS,
        locale: undefined,
      })
    )
  })
})
