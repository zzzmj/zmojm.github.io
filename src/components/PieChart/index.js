import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const PieCharts = ({ dataSource, height = 750, option = {} }) => {
    const data = useMemo(() => {
        return dataSource?.map(item => ({
            name: item.name,
            value: item.value || item.count
        }))
    }, [dataSource])
    const options = {
        title: {
            text: '考频分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: 10,
            orient: 'horizontal',
            left: 'center'
        },
        series: [
            {
                name: '考点',
                type: 'pie',
                radius: '50%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }, label: {
                    normal: {
                        formatter: '{b} : {d}%'
                    }
                }
            }
        ],
        ...option
    };
    console.log('options', options)
    return <ReactECharts
        style={{ height }}
        option={options}
    />
}

export default PieCharts