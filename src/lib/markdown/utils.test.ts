import { expect, test } from 'vitest'
import { fixUnclosedTags } from './utils'

test('fixes unclosed tags', () => {
  expect(fixUnclosedTags('<pass>Passw0rd</pass>'))
    .toBe('<pass>Passw0rd</pass>')
  expect(fixUnclosedTags('<pass>Passw0rd'))
    .toBe('<pass>Passw0rd</pass>')
  expect(fixUnclosedTags('<pass>Passw0rd</pass><pass>Passw0rd</pass>'))
    .toBe('<pass>Passw0rd</pass><pass>Passw0rd</pass>')
  expect(fixUnclosedTags('<pass>Passw0rd</pass><pass>Passw0rd'))
    .toBe('<pass>Passw0rd</pass><pass>Passw0rd</pass>')
  expect(fixUnclosedTags('<think>Thinking...</think>'))
    .toBe('<think>Thinking...</think>')
  expect(fixUnclosedTags('<think>Thinking...'))
    .toBe('<think>Thinking...</think>')
  expect(fixUnclosedTags('<think>Thinking...</think><pass>Passw0rd</pass>'))
    .toBe('<think>Thinking...</think><pass>Passw0rd</pass>')
  expect(fixUnclosedTags('<think>Thinking...</think><pass>Passw0rd'))
    .toBe('<think>Thinking...</think><pass>Passw0rd</pass>')
})
