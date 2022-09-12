// 富文本编辑器

import { Modal } from 'antd'
import React, { useEffect, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

function NotesEditor(props) {
    const editorRef = useRef(null)
    const { visible, onOk, onCancel, value } = props

    useEffect(() => {
        editorRef.current && editorRef.current.setContent(value || '')
    }, [value])

    const handleOk = () => {
        const content = editorRef.current.getContent()
        // 更新看看
        onOk && onOk(content)
    }

    const handleCancel = () => {
        onCancel && onCancel()
    }

    // const handleNotesChange = data => {
    //     const { notes, objectId, id } = data
    //     setActiveNotes({
    //         id: objectId,
    //         notes,
    //     })
    //     console.log('data', data)
    //     setIsModalVisible(true)
    // }

    return (
        <Modal
            forceRender={true}
            width={1000}
            title='编辑笔记'
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Editor
                className='notes-editor'
                onInit={(evt, editor) => {
                    editorRef.current = editor
                }}
                apiKey='24p0l3ih7zoyefn7sj47oxgrjz14zp69vuiyxo9tzk25oapj'
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'code',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                        'preview',
                        'help',
                        'wordcount',
                    ],
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style:
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
            />
        </Modal>
    )
}

export default NotesEditor
