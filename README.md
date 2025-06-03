<div align="center">

<img alt="Logo" src="./public/favicon.svg" style="width:8rem;">

# Passistant

Your personal AI password assistant.

</div>

## Overview

Passistant is a personal AI password assistant that helps you generate strong and memorable passwords, and runs locally in your browser without any data being sent to a server.

## Features

- Generate strong and memorable passwords
- Support for multiple models
- Support for multiple languages
- Reasoning support
- Privacy-focused, no data is sent to a server
- Optional WebGPU acceleration for supported browsers

## Technical Implementation

Passistant uses the [WebLLM](https://github.com/mlc-ai/web-llm) API to run the models locally in the browser.

The default model to use is [Qwen3-0.6B-q4f32_1-MLC](https://huggingface.co/Qwen/Qwen3-0.6B), but you can change it in the settings.

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS + shadcn
- WebLLM (@mlc-ai/web-llm)

## Code of Conduct

Please follow the [code of conduct](CODE_OF_CONDUCT.md).

## Contributing

Please follow the [contribution guidelines](CONTRIBUTING.md).

## License

MIT
