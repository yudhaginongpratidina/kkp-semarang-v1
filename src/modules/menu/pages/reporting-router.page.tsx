import MenuLayout from '../layouts/menu.layout';
import ReportingMenuList from '../components/menus/reporting.menu.list';
import RoleGuard from '../../../shared/auth/role-guard';

export default function ReportingRouterPage() {
    return (
        <RoleGuard feature="reporting">
            <MenuLayout>
                <ReportingMenuList />
            </MenuLayout>
        </RoleGuard>
    );
}
