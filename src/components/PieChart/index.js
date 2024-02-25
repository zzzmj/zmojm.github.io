import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const PieCharts = ({ dataSource }) => {
    const data = useMemo(() => {
        return dataSource?.map(item => ({
            name: item.name,
            value: item.count
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
            },label: {
                normal: {
                  formatter: '{b} : {d}%'
                }
              }
          }
        ]
      };
    return <ReactECharts
        style={{ height: 750 }}
        option={options}
    />
}

export default PieCharts