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
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { useTheme } from '@/context/theme-provider'

type Particle = {
  x: number
  y: number
  radius: number
  alpha: number
  phase: number
  velocityX: number
  velocityY: number
}

const FRAME_INTERVAL = 1000 / 30
const CONNECTION_DISTANCE = 140

export function ObsidianBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== 'dark') return

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let animationFrame = 0
    let lastFrame = 0
    let width = 0
    let height = 0
    let particles: Particle[] = []

    const draw = (time: number, move: boolean) => {
      context.clearRect(0, 0, width, height)

      if (move) {
        for (const particle of particles) {
          particle.x += particle.velocityX
          particle.y += particle.velocityY
          if (particle.x < -2) particle.x = width + 2
          if (particle.x > width + 2) particle.x = -2
          if (particle.y < -2) particle.y = height + 2
          if (particle.y > height + 2) particle.y = -2
        }
      }

      context.lineWidth = 0.5
      context.strokeStyle = '#ffffff'
      const maxDistanceSquared = CONNECTION_DISTANCE * CONNECTION_DISTANCE
      for (let first = 0; first < particles.length; first++) {
        const a = particles[first]
        for (let second = first + 1; second < particles.length; second++) {
          const b = particles[second]
          const deltaX = a.x - b.x
          const deltaY = a.y - b.y
          const distanceSquared = deltaX * deltaX + deltaY * deltaY
          if (distanceSquared >= maxDistanceSquared) continue

          context.globalAlpha =
            (1 - distanceSquared / maxDistanceSquared) * 0.12
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.stroke()
        }
      }

      context.fillStyle = '#ffffff'
      for (const particle of particles) {
        const twinkle = shouldReduceMotion
          ? 1
          : 0.68 + Math.sin(time * 0.0009 + particle.phase) * 0.32
        context.globalAlpha = particle.alpha * twinkle
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const count = Math.min(
        72,
        Math.max(28, Math.floor((width * height) / 24000))
      )
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.7 + Math.random() * 0.85,
        alpha: 0.22 + Math.random() * 0.22,
        phase: Math.random() * Math.PI * 2,
        velocityX: (Math.random() - 0.5) * 0.08,
        velocityY: (Math.random() - 0.5) * 0.08,
      }))
      draw(0, false)
    }

    const animate = (time: number) => {
      if (time - lastFrame >= FRAME_INTERVAL) {
        draw(time, true)
        lastFrame = time
      }
      animationFrame = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (shouldReduceMotion || document.hidden) return
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(animate)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
        return
      }
      start()
    }

    resize()
    start()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [resolvedTheme, shouldReduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden='true'
      className='obsidian-background'
    />
  )
}
