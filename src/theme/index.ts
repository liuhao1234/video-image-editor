export default {
  textColor: '#d4d4d4',
} as const

// 声明类型扩展
declare module 'antd-style' {
  interface CustomToken {
    textColor: string
  }
}