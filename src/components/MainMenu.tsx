import { Menubar } from 'primereact/menubar'
import { MenuItem } from 'primereact/menuitem'
import { Button } from 'primereact/button'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setLogined, setUser } from '../slices/app.slice';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { RoleService } from '../services/Role.service';
export default function MainMenu() {
    const dispatch = useAppDispatch()
    const role = useAppSelector(state => state.auth.role)
    const userStorageKey = import.meta.env.VITE_APP_storageUserKey
    const refreshTokenStorageKey = import.meta.env.VITE_APP_storageRefreshTokenKey
    const accessTokenStorageKey = import.meta.env.VITE_APP_storageAccessTokenKey
    const navigate = useNavigate()
    const items: MenuItem[] = [
        {
            label: t('Dashboard'),
            icon: 'ri-apps-fill',
            command: () => {
                navigate('/')
            }
        },
        {
            label: t('Services'),
            icon: 'ri-service-line',
            visible: RoleService.isAllowMenu(role, 'SERVICE'),
            command: () => {
                navigate('/products')
            }

        },
        {
            label: t('Categories'),
            icon: 'ri-align-justify',
            items: [
                {
                    label: t('Employees'),
                    icon: 'ri-user-line',
                    visible: RoleService.isAllowMenu(role, 'USER'),
                    command: () => {
                        navigate('/employees')
                    }
                },
                {
                    label: t('Partners'),
                    icon: 'ri-group-3-line',
                    visible: RoleService.isAllowMenu(role, 'PARTNER'),
                    command: () => {
                        navigate('/partners')
                    }
                },
                {
                    label: t('Roles'),
                    icon: 'ri-shield-keyhole-line',
                    visible: RoleService.isAllowMenu(role, 'ROLE'),
                    command: () => {
                        navigate('/roles')
                    }
                },
                {
                    label: t("Languages"),
                    icon: 'ri-global-line',
                    visible: RoleService.isAllowMenu(role, 'LANGUAGE'),
                    command: () => {
                        navigate('/language')
                    }
                }

            ]
        },
        {
            label: t('Reports'),
            icon: 'ri-folder-chart-fill',
            visible: RoleService.isAllowMenu(role, 'REPORT'),
            command: () => {
                navigate('/report')
            }
        }
    ];
    const end = (
        <div className="d-flex align-items-center">
            <Button type="button" label={t('Cashier')} icon="ri-user-fill" outlined rounded className='mx-3 custom-outline-white' />
            <Button type="button" label={t("Manager")} icon="ri-user-star-fill" rounded className='custom-orange-button' />
            <Button type="button" label={t("Log out")} icon="ri-logout-circle-r-line" outlined rounded className='mx-3 custom-outline-white' onClick={() => handleLogout()} />
        </div>
    );
    const handleLogout = () => {
        localStorage.removeItem(userStorageKey)
        localStorage.removeItem(refreshTokenStorageKey)
        localStorage.removeItem(accessTokenStorageKey)
        dispatch(setLogined(false))
        dispatch(setUser(false))
    }
    return <>
        <Menubar model={items} end={end} className='w-100 px-3' />
    </>
}