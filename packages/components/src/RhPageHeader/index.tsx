// import { PageHeader } from 'antd';
import { PageHeader, Tabs } from 'antd';
import type { ReactElement } from 'react';
import React from 'react';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import './index.less';

const { TabPane } = Tabs;
export type RhPageHeaderProps = {
  onChange?: (value?: string) => void;
  value?: string;
  title?: string;
  isBack?: boolean;
  tabsList?: ReactElement[] | undefined;
  rightBtns?: ReactElement[] | undefined;
  breadcrumb?: ReactElement;
  defaultValue?: string;
};

const RhPageHeader: React.FC<RhPageHeaderProps> = (props) => {
  const { title, tabsList, rightBtns, isBack, defaultValue, breadcrumb } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [value, setValue] = useMergedState<string | undefined>(defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });
  return (
    <div className={isBack ? 'PageHeader-box' : 'PageHeader-box hide-back-icon'}>
      <PageHeader
        className="site-page-header-responsive"
        onBack={() => window.history.back()}
        title={title}
        extra={rightBtns}
        breadcrumb={breadcrumb}
        footer={
          tabsList && (
            <Tabs
              defaultActiveKey="1"
              onChange={(key) => {
                setValue(key);
              }}
            >
              {tabsList.map((tab, key) => (
                <TabPane tab={tab} key={`${key + 1}`} />
              ))}
            </Tabs>
          )
        }
      />
    </div>
  );
};

export default RhPageHeader;
