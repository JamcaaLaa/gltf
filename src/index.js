import { IOBuffer } from 'iobuffer'

/**
 * 读取 glb 缓冲的文件头信息
 * @param {ArrayBufferLike | ArrayBufferView} buffer glb 数据
 * @returns {{
 *   magic: string;
 *   version: number;
 *   byteLength: number;
 * }} glb 文件头的三个字段
 * 
 * @throws {Error} 数据长度与文件头内 byteLength 字段数据不一致
 */
export const getGlbHead = (buffer) => {
  const io = new IOBuffer(buffer)
  const glbMagic = io.readChars(4)
  const version = io.readUint32()
  const bufferLength = io.readUint32()

  if (bufferLength !== buffer.byteLength) {
    throw new Error('数据长度不一致')
  }

  return {
    magic: glbMagic,
    version,
    byteLength: bufferLength
  }
}

/**
 * 解析 glb 的两个块，输出嵌在 glb 内的 gltfJSON 和二进制数据
 * @param {ArrayBufferLike | ArrayBufferView} glbBuffer glb 缓冲
 * @param {boolean} [needRewriteBuffer0Uri=true] 是否将 glb 的 0 号 buffer 的 uri 改写，默认改写
 * @param {string} [buffer0Uri=0.bin] 自定义改写 0 号 buffer 的 uri，默认 0.bin
 * @returns {{
 *   glbJSON: Object;
 *   glbBinary: ArrayBuffer;
 * }} glb 的两个块的数据
 * 
 * @throws {Error} 解析 chunk0 的 JSON 字符串有问题
 */
export const parseChunk = (glbBuffer, needRewriteBuffer0Uri = true, buffer0Uri = '0.bin') => {
  const io = new IOBuffer(glbBuffer)
  io.skip(12)

  const result = {
    glbJSON: null,
    glbBinary: null
  }

  const chunk0Length = io.readUint32()
  const chunk0Type = io.readChars(4) // 'JSON' 或 'BIN '
  
  if (chunk0Type !== 'JSON') { /* TODO */ }

  {
    const glbJSONStr = io.readChars(chunk0Length)
    try {
      result.glbJSON = JSON.parse(glbJSONStr)
    } catch (e) {
      throw new Error(e)
    }
  }

  if (needRewriteBuffer0Uri) {
    result.glbJSON['buffers'][0]['uri'] = buffer0Uri
  }
  
  const chunk1Length = io.readUint32()
  const chunk1Type = io.readChars(4)

  if (chunk1Type !== 'BIN ') { /* TODO */ }

  result.glbBinary = io.readBytes(chunk1Length).buffer

  return result
}
