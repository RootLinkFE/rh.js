import { Menu } from 'antd';
import React, { useCallback, useEffect, useMemo } from 'react';
import { ReactNode } from 'react-dom/node_modules/@types/react';
import { useHistory } from 'react-router-dom';
import IconFont from '../IconFont';
import RhMenuIcon from './Icon';
import type { RhMenuData, RhMenuItem, RhSidebarProps } from './type';
import styles from './style.less';

const { SubMenu, Item } = Menu;

const isMenuSelected = (pathname: string, currentUrl: string) => {
  return pathname && pathname.indexOf(currentUrl) > -1;
};

let Icon = IconFont;

const RhSidebar = (props: RhSidebarProps) => {
  const {
    collapsible,
    menuData = {},
    pathName = '',
    className = '',
    menuOptions = {},
    iconScriptUrl = '',
    onTitleClick = () => {},
  } = props;

  const history = useHistory();

  const {
    menuItems = [],
    subMenuCollapseIcon = '',
    subMenuExpandIcon = '',
    menuHeaderTitleIcon = '',
    menuHeaderTitle = '',
  } = menuData as RhMenuData;

  useEffect(() => {
    if (iconScriptUrl) {
      Icon = RhMenuIcon(iconScriptUrl);
    }
  }, [iconScriptUrl]);

  const menuClickHandle = useCallback(
    (obj: RhMenuItem) => {
      if (obj.isExternal) {
        window.open(obj?.url);
      } else {
        history.push(obj?.url);
      }
      onTitleClick(obj);
    },
    [onTitleClick],
  );

  const iconRender = (icon: string | ReactNode) => {
    if (!icon) {
      return null;
    }
    if (typeof icon !== 'string') {
      return (
        <div className={styles.menuIcon} style={{ marginRight: 10 }}>
          {icon}
        </div>
      );
    }
    return <Icon type={icon} className={styles.menuIcon} />;
  };

  // 所有菜单元素上均有 name=menu 这是为了神策的自动埋点统计
  const renderMenuTree = useCallback(
    (items: RhMenuItem[], isSubmenu = 1) => {
      const menuPathName =
        pathName.indexOf('?') > -1 ? pathName.split('?')[0] : pathName;

      const result = items.map((obj: RhMenuItem) => {
        if (obj.children) {
          return (
            <SubMenu
              title={
                <div className={styles.submenuContentWrapper}>
                  {iconRender(obj.icon)}
                  <span
                    className={`${styles.menuText} ${styles.subMenuText}`}
                    title={obj.name}
                  >
                    {obj.name}
                  </span>
                  <span className={collapsible ? '' : styles.collapsibleIcon}>
                    {collapsible ? (
                      <Icon
                        style={{
                          fontSize: '12px',
                          color: '#9EA5B2',
                          position: 'relative',
                          top: '-2px',
                        }}
                        type={subMenuCollapseIcon || 'rh-icon-arrow-right'}
                      />
                    ) : (
                      <Icon
                        className="ant-menu-submenu-custom-arrow"
                        type={subMenuExpandIcon || 'rh-icon-arrow-down'}
                      />
                    )}
                  </span>
                </div>
              }
              key={obj.key}
              popupClassName={styles.collaspsedPopup}
            >
              {collapsible && (
                <Item
                  key={obj.key}
                  disabled={!!obj.disabled}
                  className={styles.collaspsedMenuTitle}
                >
                  <span title={obj.name}>{obj.name}</span>
                </Item>
              )}
              {renderMenuTree(obj.children as RhMenuItem[], 0)}
            </SubMenu>
          );
        }
        if (isSubmenu && collapsible) {
          return (
            <SubMenu
              title={
                <span>
                  {/* {obj.icon ? <Icon type={obj.icon} /> : null} */}
                  {iconRender(obj.icon)}
                  <span title={obj.name}>{obj.name}</span>
                </span>
              }
              key={obj.key}
              popupClassName={styles.collaspsedPopup}
              onTitleClick={() => {
                menuClickHandle(obj);
              }}
              className={
                isMenuSelected(menuPathName, obj.url)
                  ? `rh_sidebar_selected ${styles.selected}`
                  : ''
              }
            >
              {collapsible && (
                <Item
                  key={obj.key}
                  disabled={!!obj.disabled}
                  className={styles.collaspsedMenuTitle}
                >
                  <div className={styles.submenuContentWrapper}>
                    <span
                      className={`${styles.menuText} ${styles.subMenuText}`}
                      title={obj.name}
                    >
                      {obj.name}
                    </span>
                    {obj.isExternal ? (
                      <span className={styles.externalIconWrapper}>
                        <Icon
                          type={obj.externalIcon || 'rh-icon-iconShare'}
                          className={`rh_sidebar_externalIcon ${styles.externalIcon}`}
                        />
                      </span>
                    ) : null}
                  </div>
                </Item>
              )}
            </SubMenu>
          );
        }
        return (
          <Item
            key={obj.key}
            disabled={!!obj.disabled}
            className={`rh_sidebar_collaspsedMenu ${styles.collaspsedMenu} ${
              isMenuSelected(menuPathName, obj.url)
                ? `rh_sidebar_selected ${styles.selected}`
                : ''
            }`}
            onClick={() => {
              menuClickHandle(obj);
            }}
          >
            <div className={styles.submenuContentWrapper}>
              {iconRender(obj.icon)}
              <span
                className={`${styles.menuText} ${styles.subMenuText}`}
                title={obj.name}
              >
                {obj.name}
              </span>
              {obj.isExternal ? (
                <span className={styles.externalIconWrapper}>
                  <Icon
                    type={obj.externalIcon || 'rh-icon-iconShare'}
                    className={`rh_sidebar_externalIcon ${styles.externalIcon}`}
                  />
                </span>
              ) : null}
            </div>
          </Item>
        );
      });
      return result;
    },
    [
      pathName,
      collapsible,
      subMenuCollapseIcon,
      subMenuExpandIcon,
      onTitleClick,
    ],
  );

  const renderTreeTitle = useMemo(() => {
    if (!menuHeaderTitle) {
      return null;
    }

    return (
      <Item key="menu-title" className={styles.sideMenuHeaderTitle}>
        {menuHeaderTitleIcon && (
          <Icon type={menuHeaderTitleIcon} style={{ fontSize: '20px' }} />
        )}
        <span
          className={styles.sideMenuHeaderTitleText}
          title={menuHeaderTitle}
        >
          {menuHeaderTitle}
        </span>
      </Item>
    );
  }, [menuHeaderTitleIcon, menuHeaderTitle]);

  return (
    <>
      <Menu
        className={`rh_sidebar_rhSidebarMenu ${styles.rhSidebarMenu} ${className}`}
        inlineCollapsed={collapsible}
        {...menuOptions}
      >
        {renderTreeTitle}
        {menuItems && renderMenuTree(menuItems)}
      </Menu>
    </>
  );
};

export default RhSidebar;
