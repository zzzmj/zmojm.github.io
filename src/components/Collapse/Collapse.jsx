import classNames from "classnames"

const Button = (props) => {
    const { className, show, } = props
    const cls =  classNames({
        'collapse': true,
        'show': show,
        [className]: className
    })

    return <div className={cls} >
        {props.children}
    </div>
}

export default Button