import Draggable from "react-draggable"
import './MaterialModal.scss'
import { createPortal } from "react-dom"

import {
    CloseOutlined
} from '@ant-design/icons';
const MaterialModal = ({ content, onClose }) => {

    
    return createPortal(
    
    <Draggable handle="strong" >
        <div className="material-modal">
            <div className="box no-cursor">
                <strong className="m-header cursor">
                    <div>材料</div>

                    <CloseOutlined onClick={onClose} className="close-icon" />
                </strong>
                <div className="m-content" dangerouslySetInnerHTML={{ __html:  content}} />
            </div>
        </div>
        
    </Draggable>
    , document.body)
}

export default MaterialModal