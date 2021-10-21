import { Button, message } from 'antd';
import React, { useState } from 'react';
import RhFileImportModal from '.';

const Demo = () => {
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  return (
    <div>
      {isImportModalVisible && (
        <RhFileImportModal
          title="导入弹窗Demo"
          visible={isImportModalVisible}
          downloadUrl={'http://giscafer.com'}
          onCancel={() => {
            setIsImportModalVisible(false);
          }}
          onFinish={() => {
            message.info('onFinish !');
            setIsImportModalVisible(false);
            return Promise.resolve(true);
          }}
        />
      )}

      <Button type="primary" onClick={() => setIsImportModalVisible(true)}>
        导入
      </Button>
    </div>
  );
};

export default Demo;
