import './App.css';
import React, { useMemo, useCallback, useState } from 'react';
import {
  DataSet,
  Table,
  AutoComplete,
  Button,
  Row,
  Col,
  CodeArea
} from 'choerodon-ui/pro';
import JSONFormatter from 'choerodon-ui/pro/lib/code-area/formatters/JSONFormatter';

const App = () => {
  const [consoleValue, setConsoleValue] = useState('');
  const tableDS = useMemo(()=>{
    return new DataSet({
      // 指定 DataSet 初始化后自动查询
      autoQuery: true,
      // 请求分页大小
      pageSize: 8,
      // 主键字段名，一般用作级联行表的查询字段
      primaryKey: 'id',
      // 数据对象名，默认值 'rows'
      dataKey: 'content',
      dataToJSON: 'all',
      // DataSet 中包含的字段，对应上述后端数据中每条记录中的字段
      fields: [
        { name: 'id', type: 'number' },
        {
          name: 'name',
          type: 'string',
          label: '姓名',
          unique: true, // 唯一索引或联合唯一索引组名 设置可编辑只有新增才能编辑,确保该字段或字段组唯一性
          help: '主键，区分用户',
          required: true,
        },
        {
          name: 'age',
          type: 'number',
          label: '年龄',
          max: 100,
          min: 1,
          step: 1,
          help: '用户年龄，可以排序',
        },
        {
          name: 'email',
          type: 'string',
          label: '邮箱',
          help: '用户邮箱，可以自动补全',
        },
        { name: 'code', type: 'string', label: '编码' },
        {
          name: 'sex',
          type: 'string',
          label: '性别',
          lookupUrl: 'https://www.fastmock.site/mock/423302b318dd24f1712751d9bfc1cbbc/mock/EMPLOYEE_GENDER',
          dynamicProps: {
            required: ({ record }) => record.get('age') > 18,
          },
        },
        { name: 'active', label: '状态', type: 'boolean' },
        {
          name: 'startDate',
          type: 'date',
          label: '加入日期',
        },
      ],
      queryFields: [
        {
          name: 'name',
          type: 'string',
          label: '姓名',
        },
        {
          name: 'age',
          type: 'number',
          label: '年龄',
          max: 100,
          step: 1,
        },
        {
          name: 'email',
          type: 'string',
          label: '邮箱',
          help: '用户邮箱，可以自动补全',
        }
      ],
      // 接口自定义配置
      transport: {
        // 查询请求的 axios 配置或 url 字符串
        read: {
          url: 'https://www.fastmock.site/mock/423302b318dd24f1712751d9bfc1cbbc/mock/guide/user',
          method: 'GET',
        },
        create: ({ data, params }) => {
          setConsoleValue({data, params});
          return {
            url: 'https://www.fastmock.site/mock/423302b318dd24f1712751d9bfc1cbbc/mock/guide/user',
            method: 'GET',
          };
        },
      },
      // DS 事件回调
      events: {
        load: ({ dataSet }) => {
          console.log('加载完成', dataSet)
        },
        query: ({ params, data }) => setConsoleValue({params, data}),
      }
    });
  }, []);

  const emailOptionDS = useMemo(() => {
    return new DataSet({
      fields: [
        {
          name: 'value',
          type: 'string',
        },
        {
          name: 'meaning',
          type: 'string',
        },
      ],
    });
  }, []);

  const handleValueChange = useCallback((v) => {
    const { value } = v.target;
    const suffixList = ['@qq.com', '@163.com', '@hand-china.com'];
    if (value.indexOf('@') !== -1) {
      emailOptionDS.loadData([]);
    } else {
      emailOptionDS.loadData(
        suffixList.map((suffix) => ({
          value: `${value}${suffix}`,
          meaning: `${value}${suffix}`,
        })),
      );
    }
  }, [emailOptionDS]);

  const columns = useMemo(()=>{
    return [
      { name: 'name', editor: true },
      { name: 'age', sortable: true, editor: true },
      { name: 'sex', editor: true },
      {
        name: 'email',
        editor: () => {
          return (
            <AutoComplete
              onFocus={handleValueChange}
              onInput={handleValueChange}
              options={emailOptionDS}
            />
          );
        },
      },
      { name: 'code', editor: true },
      { name: 'startDate', editor: true },
      { name: 'active', editor: true },
    ];
  }, [emailOptionDS, handleValueChange]);

  const toDataButton = (
    <Button onClick={() => setConsoleValue(tableDS.toData())}>
      toData
    </Button>
  );

  const toJSONDataButton = (
    <Button onClick={() => setConsoleValue(tableDS.toJSONData())}>
      toJSONData
    </Button>
  );

  const setQueryParamButton = (
    <Button onClick={() => tableDS.setQueryParameter('customPara', 'test')}>
      setQueryParameter
    </Button>
  );

  return (
    <>
      <Row style={{ padding: 50 }}>
        <Col span={16}>
          <h1>C7N Pro Table</h1>
          <Table
            buttons={['add', 'query', 'save', 'delete', 'reset', toDataButton, toJSONDataButton, setQueryParamButton]}
            dataSet={tableDS}
            columns={columns}
            queryBar="professionalBar"
            queryFieldsLimit={2}
          />
        </Col>
      </Row>
      <Row
        style={{ padding: 50 }}
      >
        <h1>Console.log</h1>
        <CodeArea
          style={{ height: 280 }}
          formatter={JSONFormatter}
          value={JSON.stringify(consoleValue)}
        />
      </Row>
    </>
  );
};

export default App;
