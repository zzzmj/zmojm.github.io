import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import PieCharts from "../../../components/PieChart"
import { Checkbox, Radio, Switch } from "antd"

//  filterDataList的结构如下所示，我希望你帮我统计filterDataList options每个选项成语的出现频率，并将其包装成符合echarts pie的数据结构，放到echarts中渲染

const WordFrequency = () => {
    const [visible, setVisible] = useState(false)
    const filterDataList = useSelector(state => state.book.filterDataList)
    const dataSource = useMemo(() => {
        // 创建一个对象来存储成语及其出现次数
        const frequencyMap = {};

        // 遍历filterDataList以统计每个成语的出现次数
        filterDataList.forEach(item => {
            item.accessories.forEach(accessory => {
                accessory.options.forEach(option  => {
                    const idioms = option.split(/\s+|,|，/).filter(idiom => idiom.length === 4);
                    idioms.forEach(idiom => {
                        frequencyMap[idiom] = (frequencyMap[idiom] || 0) + 1;
                    });
                });
            });
        });

        // 将统计结果转换为echarts需要的数据结构
        const chartData = Object.keys(frequencyMap).filter(key => frequencyMap[key] > 1).map(key => {
            // console.log("??", frequencyMap[key])
            return {
                name: key,
                value: frequencyMap[key]
            }
        }).sort((a, b) => b.value - a.value).slice(0, 50);
        return chartData;
    }, [filterDataList]);

    console.log('visible', visible)
    return <div>
        {/* 传入option即可 */}
        <Switch checked={visible} onChange={(checked) => setVisible(checked)} />
        {
            visible && <PieCharts dataSource={dataSource} height={1000}  />
        }
    </div>
}

export default WordFrequency