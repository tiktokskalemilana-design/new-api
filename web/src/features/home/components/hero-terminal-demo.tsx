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
import { useState, useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type AccentTone = 'emerald' | 'amber' | 'blue' | 'violet'

interface ApiDemoConfig {
  id: string
  label: string
  method: 'POST' | 'GET'
  endpoint: string
  headers: string[]
  request: string[]
  response: string[]
  responseHighlights: string[]
  tokens: number
  latency: number
  accent: AccentTone
}

const ACCENT_CLASSES: Record<
  AccentTone,
  {
    activeText: string
    badge: string
  }
> = {
  emerald: {
    activeText: 'text-neutral-900 dark:text-white',
    badge: 'bg-neutral-900 text-white dark:bg-[#fafafa] dark:text-black',
  },
  amber: {
    activeText: 'text-neutral-900 dark:text-white',
    badge: 'bg-neutral-900 text-white dark:bg-[#fafafa] dark:text-black',
  },
  blue: {
    activeText: 'text-neutral-900 dark:text-white',
    badge: 'bg-neutral-900 text-white dark:bg-[#fafafa] dark:text-black',
  },
  violet: {
    activeText: 'text-neutral-900 dark:text-white',
    badge: 'bg-neutral-900 text-white dark:bg-[#fafafa] dark:text-black',
  },
}

const API_DEMOS: ApiDemoConfig[] = [
  {
    id: 'gpt-chat',
    label: 'Chat',
    method: 'POST',
    endpoint: '/v1/chat/completions',
    headers: ['"Authorization: Bearer sk-••••"'],
    request: [
      '"model": "your-model",',
      '"messages": [',
      '  { "role": "user", "content": "..." }',
      ']',
    ],
    response: [
      '{',
      '  "choices": [{ "message": { "content": <text> } }],',
      '  "usage": { "total_tokens": <tokens> }',
      '}',
    ],
    responseHighlights: ['<text>', '<tokens>'],
    tokens: 27,
    latency: 142,
    accent: 'emerald',
  },
  {
    id: 'responses',
    label: 'Responses',
    method: 'POST',
    endpoint: '/v1/responses',
    headers: ['"Authorization: Bearer sk-••••"'],
    request: ['"model": "your-model",', '"input": "..."'],
    response: [
      '{',
      '  "output": [{ "type": "output_text", "text": <text> }],',
      '  "usage": { "total_tokens": <tokens> }',
      '}',
    ],
    responseHighlights: ['<text>', '<tokens>'],
    tokens: 31,
    latency: 168,
    accent: 'amber',
  },
  {
    id: 'claude',
    label: 'Claude',
    method: 'POST',
    endpoint: '/v1/messages',
    headers: ['"x-api-key: sk-••••"', '"anthropic-version: 2023-06-01"'],
    request: [
      '"model": "your-model",',
      '"max_tokens": 1024,',
      '"messages": [',
      '  { "role": "user", "content": "..." }',
      ']',
    ],
    response: [
      '{',
      '  "content": [{ "type": "text", "text": <text> }],',
      '  "usage": { "input_tokens": <in>, "output_tokens": <out> }',
      '}',
    ],
    responseHighlights: ['<text>', '<in>', '<out>'],
    tokens: 29,
    latency: 156,
    accent: 'blue',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    method: 'POST',
    endpoint: '/v1beta/models/{model}:generateContent',
    headers: ['"x-goog-api-key: sk-••••"'],
    request: [
      '"contents": [',
      '  { "role": "user",',
      '    "parts": [{ "text": "..." }] }',
      ']',
    ],
    response: [
      '{',
      '  "candidates": [{ "content": { "parts": [{ "text": <text> }] } }],',
      '  "usageMetadata": { "totalTokenCount": <tokens> }',
      '}',
    ],
    responseHighlights: ['<text>', '<tokens>'],
    tokens: 25,
    latency: 93,
    accent: 'violet',
  },
]

const CYCLE_INTERVAL = 4500
const TRANSITION_MS = 220

interface HeroTerminalDemoProps {
  className?: string
}

export function HeroTerminalDemo(props: HeroTerminalDemoProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    intervalRef.current = setInterval(() => {
      setTransitioning(true)
      timeoutRef.current = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % API_DEMOS.length)
        setTransitioning(false)
      }, TRANSITION_MS)
    }, CYCLE_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleSelect = (index: number) => {
    if (index === activeIndex) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setTransitioning(true)
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(index)
      setTransitioning(false)
    }, TRANSITION_MS)
  }

  const demo = API_DEMOS[activeIndex]
  const accent = ACCENT_CLASSES[demo.accent]

  return (
    <div className={cn('mx-auto w-full max-w-2xl', props.className)}>
      <div
        className={cn(
          'overflow-hidden rounded-[18px] border',
          'border-neutral-200 bg-white dark:border-[#1c1b20] dark:bg-[#0d0c11]'
        )}
      >
        {/* Tab strip */}
        <div
          className={cn(
            'flex items-center gap-1 border-b px-2 sm:gap-1.5 sm:px-3',
            'border-neutral-200 dark:border-[#201f24]'
          )}
        >
          {API_DEMOS.map((item, index) => {
            const tone = ACCENT_CLASSES[item.accent]
            const isActive = index === activeIndex
            return (
              <button
                key={item.id}
                type='button'
                onClick={() => handleSelect(index)}
                className={cn(
                  'relative my-0.5 flex h-10 items-center gap-1.5 rounded-[10px] border px-1.5 font-mono text-[11px] font-medium tracking-[0.15em] uppercase transition-colors sm:px-3 sm:text-xs',
                  isActive
                    ? `${tone.activeText} border-neutral-200 bg-neutral-100 dark:border-[#1f1e23] dark:bg-[#19181d]`
                    : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:text-[#616065] dark:hover:text-[#c0bfc4]'
                )}
              >
                {item.label}
              </button>
            )
          })}
          <div className='ml-auto hidden items-center gap-1 pr-1 sm:flex sm:gap-2 sm:pr-3'>
            <span className='inline-block size-1.5 rounded-full bg-neutral-400 dark:bg-[#c0bfc4]' />
            <span className='font-mono text-[11px] tracking-[0.15em] text-neutral-500 uppercase dark:text-[#616065]'>
              200 ok
            </span>
          </div>
        </div>

        {/* Endpoint row */}
        <div
          className={cn(
            'flex items-center gap-2.5 border-b px-4 py-3',
            'border-neutral-200 dark:border-[#201f24]'
          )}
        >
          <span
            className={cn(
              'rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-[0.15em]',
              accent.badge
            )}
          >
            {demo.method}
          </span>
          <code
            className={cn(
              'truncate font-mono text-[12.5px] text-neutral-800 transition-opacity duration-200 dark:text-white',
              transitioning ? 'opacity-0' : 'opacity-100'
            )}
          >
            {demo.endpoint}
          </code>
        </div>

        {/* Body — fixed rows so neither block shifts when switching demos */}
        <div className='grid h-[400px] grid-rows-[235px_minmax(0,1fr)] font-mono text-[12.5px] leading-[1.55]'>
          {/* Request */}
          <RequestBlock demo={demo} transitioning={transitioning} />

          {/* Response */}
          <ResponseBlock demo={demo} transitioning={transitioning} />
        </div>

        {/* Footer metrics */}
        <div
          className={cn(
            'flex items-center justify-between border-t px-4 py-2.5',
            'border-neutral-200 bg-neutral-50 dark:border-[#201f24] dark:bg-[#0d0d0d]'
          )}
        >
          <div className='flex items-center gap-3 font-mono text-[11px] text-neutral-500 tabular-nums dark:text-[#616065]'>
            <span className='flex items-center gap-1'>
              <span className='font-mono'>{demo.latency}</span>
              <span className='tracking-[0.15em] uppercase'>ms</span>
            </span>
            <span className='bg-foreground/15 size-1 rounded-full' />
            <span className='flex items-center gap-1'>
              <span className='font-mono'>{demo.tokens}</span>
              <span className='tracking-[0.15em] uppercase'>tokens</span>
            </span>
            <span className='bg-foreground/15 size-1 rounded-full' />
            <span className='flex items-center gap-1'>
              <span className='tracking-[0.15em] uppercase'>cost</span>
              <span className='font-mono'>
                ${(demo.tokens * 0.00003).toFixed(5)}
              </span>
            </span>
          </div>
          <span className='font-mono text-[11px] tracking-[0.15em] text-neutral-400 uppercase dark:text-[#616065]'>
            stream · sse
          </span>
        </div>
      </div>
    </div>
  )
}

function RequestBlock(props: { demo: ApiDemoConfig; transitioning: boolean }) {
  const { demo, transitioning } = props

  return (
    <div className='relative px-4 py-4'>
      <SectionLabel>Request</SectionLabel>
      <div
        className={cn(
          'mt-2 transition-opacity duration-200',
          transitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        <CodeLine>
          <Command>curl</Command> <Flag>-X</Flag> <Flag>POST</Flag>{' '}
          <StringText>&quot;{demo.endpoint}&quot;</StringText>{' '}
          <Muted>{'\\'}</Muted>
        </CodeLine>
        {demo.headers.map((header) => (
          <CodeLine key={header} indent={2}>
            <Flag>-H</Flag> <StringText>{header}</StringText>{' '}
            <Muted>{'\\'}</Muted>
          </CodeLine>
        ))}
        <CodeLine indent={2}>
          <Flag>-d</Flag> <StringText>&apos;{'{'}</StringText>
        </CodeLine>
        {demo.request.map((line) => (
          <CodeLine key={line} indent={4}>
            {renderJsonLine(line)}
          </CodeLine>
        ))}
        <CodeLine indent={2}>
          <StringText>{'}'}&apos;</StringText>
        </CodeLine>
      </div>
    </div>
  )
}

function ResponseBlock(props: { demo: ApiDemoConfig; transitioning: boolean }) {
  const { demo, transitioning } = props

  return (
    <div
      className={cn(
        'relative border-t px-4 py-4',
        'border-neutral-200 bg-neutral-50/60 dark:border-[#201f24] dark:bg-[#0d0d0d]'
      )}
    >
      <SectionLabel>Response</SectionLabel>
      <div
        className={cn(
          'mt-2 transition-opacity duration-200',
          transitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        {demo.response.map((line) => (
          <CodeLine key={line}>{renderResponseLine(line, demo)}</CodeLine>
        ))}
      </div>
    </div>
  )
}

function SectionLabel(props: { children: ReactNode }) {
  return (
    <span className='font-mono text-[11px] font-medium tracking-[0.15em] text-neutral-500 uppercase dark:text-[#636267]'>
      {props.children}
    </span>
  )
}

const STRING_RE = /"[^"]*"/g
const PLACEHOLDER_RE = /<[a-z]+>/gi

function renderJsonLine(line: string): ReactNode {
  if (!line.trim()) return <Muted> </Muted>
  return tokenize(line)
}

function renderResponseLine(line: string, demo: ApiDemoConfig): ReactNode {
  if (!line.trim()) return <Muted> </Muted>

  const segments: ReactNode[] = []
  let cursor = 0
  const matches = [...line.matchAll(PLACEHOLDER_RE)]

  if (matches.length === 0) return tokenize(line)

  matches.forEach((match) => {
    const start = match.index ?? 0
    if (start > cursor) {
      segments.push(
        <span key={`pre-${start}`}>{tokenize(line.slice(cursor, start))}</span>
      )
    }
    const placeholder = match[0]
    if (placeholder === '<text>') {
      segments.push(
        <Accent key={`ph-${start}`} accent={demo.accent}>
          {`"${truncateResponse(demo)}"`}
        </Accent>
      )
    } else if (placeholder === '<tokens>') {
      segments.push(<NumberText key={`ph-${start}`}>{demo.tokens}</NumberText>)
    } else if (placeholder === '<in>') {
      segments.push(
        <NumberText key={`ph-${start}`}>
          {Math.floor(demo.tokens * 0.4)}
        </NumberText>
      )
    } else if (placeholder === '<out>') {
      segments.push(
        <NumberText key={`ph-${start}`}>
          {Math.ceil(demo.tokens * 0.6)}
        </NumberText>
      )
    } else {
      segments.push(<Muted key={`ph-${start}`}>{placeholder}</Muted>)
    }
    cursor = start + placeholder.length
  })

  if (cursor < line.length) {
    segments.push(<span key='tail'>{tokenize(line.slice(cursor))}</span>)
  }

  return segments
}

function truncateResponse(demo: ApiDemoConfig): string {
  const map: Record<string, string> = {
    'gpt-chat': 'Chat request routed.',
    responses: 'Response workflow ready.',
    claude: 'Claude message routed.',
    gemini: 'Gemini request served.',
  }
  return map[demo.id] ?? '...'
}

function tokenize(input: string): ReactNode {
  // Split string into "..." string runs and the rest, then color keys/punct.
  const segments: ReactNode[] = []
  let cursor = 0
  const matches = [...input.matchAll(STRING_RE)]

  matches.forEach((match) => {
    const start = match.index ?? 0
    if (start > cursor) {
      segments.push(
        <Muted key={`m-${start}`}>{input.slice(cursor, start)}</Muted>
      )
    }
    const text = match[0]
    const after = input.slice(start + text.length).trimStart()
    const isKey = after.startsWith(':')
    if (isKey) {
      segments.push(<Key key={`k-${start}`}>{text}</Key>)
    } else {
      segments.push(<StringText key={`s-${start}`}>{text}</StringText>)
    }
    cursor = start + text.length
  })

  if (cursor < input.length) {
    segments.push(<Muted key='tail'>{input.slice(cursor)}</Muted>)
  }

  return segments
}

function CodeLine(props: { children: ReactNode; indent?: number }) {
  return (
    <div className='break-words whitespace-pre-wrap'>
      {props.indent ? (
        <span
          aria-hidden
          className='inline-block'
          style={{ width: `${props.indent}ch` }}
        />
      ) : null}
      {props.children}
    </div>
  )
}

function Command(props: { children: ReactNode }) {
  return (
    <span className='font-medium text-neutral-900 dark:text-white'>
      {props.children}
    </span>
  )
}

function Flag(props: { children: ReactNode }) {
  return (
    <span className='text-neutral-500 dark:text-[#c0bfc4]'>
      {props.children}
    </span>
  )
}

function Key(props: { children: ReactNode }) {
  return (
    <span className='text-neutral-800 dark:text-white'>{props.children}</span>
  )
}

function StringText(props: { children: ReactNode }) {
  return (
    <span className='text-neutral-600 dark:text-[#c0bfc4]'>
      {props.children}
    </span>
  )
}

function NumberText(props: { children: ReactNode }) {
  return (
    <span className='font-medium text-neutral-800 dark:text-white'>
      {props.children}
    </span>
  )
}

function Muted(props: { children: ReactNode }) {
  return (
    <span className='text-neutral-500 dark:text-[#636267]'>
      {props.children}
    </span>
  )
}

function Accent(props: { children: ReactNode; accent: AccentTone }) {
  const tone = ACCENT_CLASSES[props.accent]
  return (
    <span className={cn('font-medium', tone.activeText)}>{props.children}</span>
  )
}
