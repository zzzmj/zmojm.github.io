import React from 'react'
import loadable from '@loadable/component'
const Admin = loadable(() => import('../feature/admin/Admin'))
const ShenLun = loadable(() => import('../feature/shenlun'))
const Book = loadable(() => import('../feature/book/Book'))
const TestBook = loadable(() => import('../feature/book/Test'))
const BookList = loadable(() => import('../feature/book/BookList'))
const TestBookList = loadable(() => import('../feature/book/TestBookList'))
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
const Interview = loadable(() => import('../feature/interview'))
const Ps = loadable(() => import('../feature/ps/index'))
const CategoryList = loadable(() => import('../feature/category/CategoryList'))
const ExtractPdf = loadable(() => import('../feature/extractPdf'))
const PrintQuestion = loadable(() => import('../feature/printQuestion'))

const routes = [
    {
        path: '/',
        element: <Admin />,
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
    {
        path: '/book',
        element: <Book />,
        meta: { title: '习题集' },
    },
    {
        path: '/category',
        element: <CategoryList />,
        meta: { title: '分类' },
    },
    {
        path: '/test_book',
        element: <TestBook />,
        meta: { title: '测试习题集' },
    },
    {
        path: '/book/:objectId',
        element: <BookList />,
        meta: { title: '练习' },
    },
    {
        path: '/test_book/:objectId',
        element: <TestBookList />,
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
    {
        path: '/interview',
        element: <Interview />,
        meta: { title: '面试' },
    },
    {
        path: '/ps',
        element: <Ps />,
        meta: { title: '切图工具' },
    },
    {
        path: '/extractPdf',
        element: <ExtractPdf />,
        meta: { title: '提取PDF' },
    },
    {
        path: '/printQuestion',
        element: <PrintQuestion />,
        meta: { title: '打印题目' },
    },
]

export default routes
