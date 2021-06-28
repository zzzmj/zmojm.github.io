import classNames from "classnames"
import './Annotation.scss'

// 侧边栏
const Annotation = (props) => {
    const { className } = props

    const prefix = "zz-annotation"
    const cls =  classNames({
        [prefix]: true,
        [className]: className
    })


    return <div className={cls}>
        <div className="title">文章标题</div>
        <div>
            {"199312北语.0000211235231103\r\n    您好！我是×××，33岁，我是韩国外国语大学中文系毕业的，我念大学的时候，努力用功读书，学会三种外语，那就是汉语、日语、英语。我大学毕业以后在一个贸易公司工作，但是对我来说，接洽贸易不是我的爱好，不感兴趣。我从小就喜欢世界的历史，我想，长大了以后应该走遍天下。可是工作在贸易公司没有那种机会，每天在办公室里忙着写传真每天晚上跟各国的客户一起喝酒，连看一本书的工夫都没有。在今天的早报上偶然看见了你们快乐家庭旅游公司的招聘启事，我很高兴，很感兴趣。虽然我从来没从事过旅游业，但是我擅长三种外语，还会用电脑和打字机，我想最关键的是我有毅力，很有自信。每逢困境时，我废寝忘食地努力解决种种问题，从困境中就解脱出来。我对你们的公司要求的职位是导游，如果我可以当导游的话，一边是为我们的公司服务，一边是实现我小的时候所怀着的愿望。如果你们聘用我，我一定要竭诚尽力地工作。我恳切等着你们的回信，谢谢！\r\n\r\n \r\n                                                        （132H）（153Z）"}
        </div>
    </div>
}

export default Annotation