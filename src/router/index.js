import React from 'react'
import loadable from '@loadable/component'
const Admin = loadable(() => import('../feature/admin/Admin'))
const ShenLun = loadable(() => import('../feature/shenlun'))
const Book = loadable(() => import('../feature/book/Book'))
const BookList = loadable(() => import('../feature/book/BookList'))
const Calc2 = loadable(() => import('../feature/calc/Calc2'))
const WrongQuestion = loadable(() =>
    import('../feature/wrongQuestion/WrongQuestion')
)
const XingCe = loadable(() => import('../feature/xingce/XingCe'))
const XingCeList = loadable(() => import('../feature/xingce/XingCeList'))
const Exam = loadable(() => import('../feature/xingce/Exam'))
const CalcPdf = loadable(() => import('../feature/calc/CalcPdf'))
const EditCompoent = loadable(() => import('../feature/edit/Edit'))
const Idiom = loadable(() => import('../feature/idiom'))

const routes = [
    {
        path: '/',
        redirect: '/index', // 路由重定向字段
    },
    {
        path: '/index',
        element: <Admin />,
        meta: {
            title: '首页',
        },
    },
    {
        path: '/shenlun',
        element: <ShenLun />,
        meta: { title: '申论' },
    },
    {
        path: '/edit/:objectId',
        element: <EditCompoent />,
        meta: { title: '申论' },
    },
    {
        path: '/calc',
        element: <Calc2 />,
        meta: { title: '速算' },
    },
    {
        path: '/calcPdf',
        element: <CalcPdf />,
        meta: { title: '' },
    },
    // {
    //     path: '/test',
    //     element: <Test />,
    //     meta: { title: '测试' },
    // },
    {
        path: '/book',
        element: <Book />,
        meta: { title: '习题集' },
    },
    {
        path: '/book/:objectId',
        element: <BookList />,
        meta: { title: '练习' },
    },
    {
        path: '/question',
        element: <WrongQuestion />,
        meta: { title: '错题' },
    },
    {
        path: '/XingCe',
        element: <XingCe />,
        meta: { title: '' },
    },
    {
        path: '/XingCe/:objectId',
        element: <XingCeList />,
        meta: { title: '' },
    },
    {
        path: '/exam',
        element: <Exam />,
        meta: { title: '测验' },
    },
    {
        path: '/idiom',
        element: <Idiom />,
        meta: { title: '成语词典' },
    },
]

export default routes
