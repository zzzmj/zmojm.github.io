import classNames from "classnames"
import './SideBar.scss'

// 侧边栏
const SideBar = (props) => {
    const { className } = props

    const prefix = "zz-sidebar"
    const cls =  classNames({
        [prefix]: true,
        [className]: className
    })


    return <div className={cls}>
        <div className="select">这里应该有个搜索框</div>
        <ul>
            <li>标题标题标题</li>
            <li>标题标题标题</li>
            <li>标题标题标题</li>
            <li>标题标题标题</li>
            <li>标题标题标题</li>
            <li>标题标题标题</li>
        </ul>
    </div>
}

export default SideBar