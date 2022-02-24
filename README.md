# Introduction

``` js
import { getGlbHead, parseChunk } from '@openspacing/gltf'

const fetchData = async (pathToGlb) => {
  const glbBuffer = await fetch(pathToGlb).then((res) => res.arrayBuffer())
  
  const {
    magic, // always 'glTF'
    version, // 1 or 2
    byteLength, // === glbBuffer.byteLength
  } = getGlbHead(glbBuffer)

  const {
    glbJSON, // glTF JSONObject
    glbBinary, // ArrayBuffer
  } = parseChunk(glbBuffer)

  // ...
}
```