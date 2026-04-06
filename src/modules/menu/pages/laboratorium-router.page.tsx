import MenuLayout from '../layouts/menu.layout';
import LaboratoriumMenuList from '../components/menus/laboratorium.menu.list';

export default function LaboratoriumRouterPage() {
    return (
        <>
            <MenuLayout>
                <LaboratoriumMenuList />
            </MenuLayout>
        </>
    );
}
