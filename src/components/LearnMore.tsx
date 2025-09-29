import type { Component } from 'solid-js'

export const LearnMore: Component = () => {
  return (
    <p class="text-sm text-gray-600">
      Visit{' '}
      <a
        class="text-blue-600 hover:underline"
        href="https://start.solidjs.com"
        target="_blank"
      >
        start.solidjs.com
      </a>{' '}
      to learn how to build SolidStart apps.
    </p>
  )
}

