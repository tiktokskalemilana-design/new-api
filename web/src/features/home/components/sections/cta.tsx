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
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative z-10 overflow-hidden px-4 py-16 md:px-6 md:py-32'>
      <AnimateInView
        className='mx-auto max-w-2xl text-center'
        animation='scale-in'
      >
        <h2 className='text-[24px] leading-[1.2] font-bold tracking-tight md:text-4xl dark:text-white'>
          {t('Ready to simplify')}
          <br />
          <span>{t('your AI integration?')}</span>
        </h2>
        <p className='text-muted-foreground/80 mx-auto mt-5 max-w-md text-sm leading-[1.6] md:text-base dark:text-[#c0bfc4]'>
          {t(
            'Deploy your own gateway and start routing requests through your configured upstream services.'
          )}
        </p>
        <div className='mt-8 flex items-center justify-center gap-3'>
          <Button
            className='group h-12 rounded-[16px] px-5 text-sm font-semibold shadow-none dark:bg-white dark:text-black dark:hover:bg-[#c0bfc4]'
            render={<Link to='/sign-up' />}
          >
            {t('Get Started')}
            <ArrowRight className='ml-1 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
          <Button
            variant='outline'
            className='border-border/50 hover:border-border hover:bg-muted/50 h-12 rounded-[16px] px-5 text-sm font-semibold shadow-none dark:border-[#1f1f1f] dark:bg-[#0d0d0d] dark:text-[#c0bfc4] dark:hover:border-[#636267] dark:hover:bg-[#19181d] dark:hover:text-white'
            render={<Link to='/pricing' />}
          >
            {t('View Pricing')}
          </Button>
        </div>
      </AnimateInView>
    </section>
  )
}
