import React from 'react'
import { Form } from 'react-bootstrap'
import Modal from '../../components/Modal/Modal'

const AddModal = props => {
    const { show } = props

    const handleChange = e => {
        console.log('e', e)
    }

    const handleConfirm = () => {
        props.onConfirm && props.onConfirm()
    }

    const handleClose = () => {
        props.onClose && props.onClose()
    }

    return (
        <Modal
            title='添加文章'
            show={show}
            onClose={handleClose}
            onConfirm={handleConfirm}
        >
            <Form>
                <Form.Group controlId='exampleForm.ControlInput1'>
                    <Form.Label>文章标题</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='请输入文章标题'
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group required controlId='exampleForm.ControlSelect1'>
                    <Form.Label>请选择语料库来源</Form.Label>
                    <Form.Control as='select'>
                        <option>A语料库</option>
                        <option>B语料库</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='exampleForm.ControlSelect2'>
                    <Form.Label>请选择汉语等级</Form.Label>
                    <Form.Control onChange={handleChange} as='select'>
                        <option>A</option>
                        <option>B</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='exampleForm.ControlSelect2'>
                    <Form.Label>请选择汉语等级</Form.Label>
                    <Form.Control onChange={handleChange} as='select'>
                        <Form.Check
                            inline
                            label='first radio'
                            name='formHorizontalRadios'
                            id='formHorizontalRadios1'
                        />
                        <Form.Check
                            inline
                            label='second radio'
                            name='formHorizontalRadios'
                            id='formHorizontalRadios2'
                        />
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='exampleForm.ControlTextarea1'>
                    <Form.Label>Example textarea</Form.Label>
                    <Form.Control as='textarea' rows={3} />
                </Form.Group>
            </Form>
        </Modal>
    )
}

export default AddModal
