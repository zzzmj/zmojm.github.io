import classNames from "classnames"
import './Header.scss'

const Header = (props) => {
    const { className } = props

    const prefix = "zz-header"
    const cls =  classNames({
        [prefix]: true,
        [className]: className
    })


    return <div className={cls}>
        <div className="left">
            <div className="logo">这里应该放一个Logo</div>
        </div>
        <div className="right">
            <div>
                这边有一些操作按钮
            </div>
        </div>
    </div>
}

export default Header