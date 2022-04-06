import express from 'express'
import cors from 'cors'
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';

const PORT = process.env.PORT || 8080;

const app = express()

app.use(cors())



app.get('/test', (req, res) => res.send('OK'))


app.use('/baunilha', createProxyMiddleware({
    target: 'https://www.chalebaunilha.com.br/',
    changeOrigin: true,
    pathRewrite: {
        '^/baunilha': '/'
    }
}))


app.use('/face', createProxyMiddleware({
    target: 'https://web.facebook.com/',
    changeOrigin: true,
    pathRewrite: {
        '^/face': '/'
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const response = responseBuffer.toString('utf-8')
        return response
            .replace(/web.facebook.com\//g, 'localhost:8080/face/')
            .replace(/(action=[\"\']\/)/g, '$1face/')
    })
}))



app.listen(PORT, () => console.log(`Run in port ${PORT}`))