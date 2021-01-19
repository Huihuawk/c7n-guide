import './App.css';
import React, { useMemo } from 'react';
import { DataSet, Table } from 'choerodon-ui/pro';

const App = () => {
  const tableDS = useMemo(()=>{
    return new DataSet({
      // 指定 DataSet 初始化后自动查询
      autoQuery: true,
      // 请求分页大小
      pageSize: 8,
      // 主键字段名，一般用作级联行表的查询字段
      primaryKey: 'id',
      // 对应后端接口，自动生成约定的 submitUrl, queryUrl...
      name: 'user',
      // 数据对象名，默认值 'rows'
      dataKey: 'content',
      // DataSet 中包含的字段，对应上述后端数据中每条记录中的字段
      fields: [
        { name: 'id', type: 'number' },
        { name: 'name', type: 'string', label: '姓名' },
        { name: 'code', type: 'string', label: '编码' },
        { name: 'sex', type: 'string', label: '性别', lookupUrl: 'https://www.fastmock.site/mock/423302b318dd24f1712751d9bfc1cbbc/mock/EMPLOYEE_GENDER' },
        { name: 'active', label: '状态', type: 'boolean' },
      ],
      // 接口自定义配置
      transport: {
        // 查询请求的 axios 配置或 url 字符串
        read: {
          url: 'https://www.fastmock.site/mock/423302b318dd24f1712751d9bfc1cbbc/mock/guide/user',
          method: 'GET',
        }
      },
      // DS 事件回调
      events: {
        load: ({ dataSet }) => {
          console.log('加载完成', dataSet)
        }
      }
    });
  }, []);

  const columns = useMemo(()=>{
    return [
      { name: 'name' },
      { name: 'sex' },
      { name: 'code' },
      { name: 'active' },
    ];
  }, []);

  return (
    <div style={{ width: 1200, padding: 100 }}>
      <h1>C7N Pro Table</h1>
      <Table
        dataSet={tableDS}
        columns={columns}
      />
    </div>
  );
};

export default App;
