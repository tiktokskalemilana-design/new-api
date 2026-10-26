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
import { Settings, Zap, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '1',
      title: t('Configure'),
      desc: t(
        'Add your API keys, set up channels and configure access permissions'
      ),
      icon: <Settings className='size-6' strokeWidth={1.5} />,
    },
    {
      num: '2',
      title: t('Connect'),
      desc: t(
        'Connect through OpenAI, Claude, Gemini, and other compatible API routes'
      ),
      icon: <Zap className='size-6' strokeWidth={1.5} />,
    },
    {
      num: '3',
      title: t('Monitor'),
      desc: t('Track usage, costs and performance with real-time analytics'),
      icon: <BarChart3 className='size-6' strokeWidth={1.5} />,
    },
  ]

  return (
    <section className='border-border/40 relative z-10 border-t px-4 py-16 md:px-6 md:py-32 dark:border-[#242328]'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-10 text-left md:mb-14'>
          <p className='text-muted-foreground mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.15em] uppercase dark:text-[#616065]'>
            <span className='dark:text-[#5e5d62]'>/01</span>
            {t('How It Works')}
          </p>
          <h2 className='text-[22px] font-bold tracking-tight md:text-3xl dark:text-white'>
            {t('Three steps to get started')}
          </h2>
        </AnimateInView>

        <div className='grid gap-4 md:grid-cols-3 md:gap-6'>
          {steps.map((step, i) => (
            <AnimateInView
              key={step.num}
              delay={i * 150}
              animation='fade-up'
              className='border-border/60 bg-background relative flex flex-col items-start rounded-[18px] border p-4 text-left shadow-none dark:border-[#1f1f1f] dark:bg-[#0d0d0d]'
            >
              <div className='mb-8 flex w-full items-center justify-between'>
                <div className='text-muted-foreground border-border/50 bg-muted/30 flex size-10 items-center justify-center rounded-xl border transition-colors dark:border-[#1f1f1f] dark:bg-transparent dark:text-[#c0bfc4]'>
                  {step.icon}
                </div>
                <span className='text-muted-foreground font-mono text-[11px] tracking-[0.15em] dark:text-[#616065]'>
                  {step.num.padStart(2, '0')}
                </span>
              </div>
              <h3 className='mb-2 text-base font-semibold dark:text-white'>
                {step.title}
              </h3>
              <p className='text-muted-foreground text-sm leading-relaxed dark:text-[#c0bfc4]'>
                {step.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
