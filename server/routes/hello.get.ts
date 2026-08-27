export default defineEventHandler(() => {
  return { hello: "world", host: process.env.HOST }
})
