#!/bin/bash
rm -r -f castle-engine
git clone https://github.com/Kagamma/castle-engine.git
cd castle-engine
git checkout wasm32-wasi-port
cd ..