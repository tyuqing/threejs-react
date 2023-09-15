import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/jifang">机房</Link>
        </li>
        <li>
          <Link to="/louyu_obj">楼宇obj</Link>
        </li>
        <li>
          <Link to="/louyu_gltf">楼宇gltf</Link>
        </li>
        <li>
          <Link to="/ditu_gltf">地图gltf</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
