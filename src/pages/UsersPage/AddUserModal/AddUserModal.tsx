import React, { useState, useEffect } from 'react';
import { Modal, Box, Checkbox, FormControlLabel } from '@mui/material';
import Select, { StylesConfig } from 'react-select';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CircleLoader } from 'react-spinners';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserPermission } from '../../../enums/PermissionEnums';
import { createUser, editUserById } from '../../../services/user.service';
import * as Yup from 'yup';

import styles from './AddUserModal.module.css';

import eye from '../../../assets/users-page/eye.svg';
import edit from '../../../assets/users-page/edit.svg';
import comment from '../../../assets/users-page/chat.svg';
import plus from '../../../assets/users-page/plus-sm.svg';
import searchIcon from '../../../assets/users-page/search.svg';
import icon from '../../../assets/auth/eye-off.svg';


const myCustomStyles = {
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
};

const progressBarStyles = {
    background: '#556EE6',
};

const CustomCheckmark = () => (
    <div style={{ color: '#556EE6' }}>✔</div>
);

const CustomErrorIcon = () => (
    <div style={{ color: 'red' }}>✘</div>
);

type User = {
    address_line1: string;
    city: string;
    country: string;
    current_plan: null | number;
    email: string;
    first_name: string;
    id: number;
    joined: string;
    last_login: string;
    last_name: string;
    role: string;
    zip_code: number;
    company?: string;
    user_permissions?: number[];
    is_superuser?: boolean;
    is_staff?: boolean;
};


interface IModal {
    openModal: boolean;
    openEditModal: boolean;
    user?: User;
    handleAddUser?: () => void;
    handleClose: () => void;
    handleClearSearch?: () => void;
    handleSearch?: () => void;
    handleCloseEditModal: () => void;
    userByIdLoading: boolean;
}

interface IOption {
    value: string;
    label: string;
}

interface Item {
    id: number;
    label: string;
}

const customStyles: StylesConfig = {
    control: (provided, state) => ({
        ...provided,
        height: '24px',
        display: 'flex',
        padding: '5px 10px',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '4px',
        border: '1px solid var(--text-color-20, #EFF2F7)',
        background: 'var(--text-color-10, #FFF)',
        minHeight: 'none',
        fontSize: '7px',
        boxShadow: 'none',
        "&:hover": {
            borderColor: "none"
        }
    }),

    valueContainer: (provided, state) => ({
        ...provided,
        padding: '0 6px',
        fontSize: '7px',
    }),

    input: (provided, state) => ({
        ...provided,
        margin: '0px',
    }),
    indicatorSeparator: state => ({
        display: 'none',
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '8px',
        width: '8px'
    }),

    dropdownIndicator: styles => ({
        ...styles,
        height: '8px',
        width: '8px',
        padding: '0px',
        marginBottom: '5px',
        fontSize: '7px',
    }),

    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? "#EFF2F7" : "",
        color: '#495057',
        fontSize: '7px',
        "&:hover": {
            ...styles,
            backgroundColor: "#EFF2F7",
            fontSize: '7px',
            color: '#495057'
        }
    })
};

const initialItems: Item[] = [
    { id: 1, label: 'Item 1' },
    { id: 2, label: 'Item 2' },
    { id: 3, label: 'Item 3' },
    { id: 4, label: 'Item 4' },
    { id: 5, label: 'Item 5' },
    { id: 6, label: 'Item 6' },
    { id: 7, label: 'Item 7' },
];

const typeOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'staff', label: 'Staff' },
    { value: 'client', label: 'Client' },
];

export default function AddUserModal({ openModal, handleAddUser, handleClose, handleCloseEditModal, openEditModal, user, userByIdLoading }: IModal) {

    const createValidationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        email: Yup.string().required('Email is required'),
        selectedType: openEditModal ?
            Yup.object().shape({
                label: Yup.string(),
                value: Yup.string(),
            })
            :
            Yup.object().shape({
                label: Yup.string().required('Label is required'),
                value: Yup.string().required('Value is required'),
            })
        ,
        view: Yup.boolean(),
        edit: Yup.boolean(),
        comment: Yup.boolean(),
        create: Yup.boolean(),
        createPassword: openEditModal
            ? Yup.string()
            : Yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters'),
        confirmPassword: openEditModal
            ? Yup.string()
            : Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('createPassword')], 'Passwords must match'),
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const { control, handleSubmit, reset, formState: { errors }, setValue,
    } = useForm({ resolver: yupResolver(createValidationSchema) });

    const initialSelectedType = () => {
        if (user) {
            if (user.is_superuser) {
                return typeOptions.find(option => option.value === 'Admin');
            } else if (user.is_staff) {
                return typeOptions.find(option => option.value === 'Staff');
            }
        }
        return typeOptions.find(option => option.value === 'Client');
    };

    const [selectedType, setSelectedType] = useState(initialSelectedType());
    const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState('');
    const [items, setItems] = useState<Item[]>(initialItems);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [checked, setChecked] = useState({
        view: null,
        edit: null,
        comment: null,
        create: null,
    });

    useEffect(() => {
        if (openEditModal && user) {
            setValue('selectedType', { label: user.role, value: user.role });
            setValue('firstName', user.first_name);
            setValue('email', user.email);
        } else {
            reset();
        }
    }, [openEditModal, user, setValue, reset]);

    const handleCloseModal = () => {
        reset();
        if (openModal) {
            handleClose();
        } else if (openEditModal) {
            handleCloseEditModal();
        }
    }

    const handleTypeChange = (selectedOption: any) => {
        setSelectedType(selectedOption);
    };

    const handleCheckboxChange = (id: number) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked: isChecked } = event.target;
        setChecked({ ...checked, [name]: isChecked });
    };


    const handleSelectAllChange = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const newCheckedItems: { [key: number]: boolean } = items.reduce((acc, item) => {
            acc[item.id] = newSelectAll;
            return acc;
        }, {} as { [key: number]: boolean });

        setCheckedItems(newCheckedItems);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        searchItems(value);
    };

    const searchItems = (search: string) => {
        if (!search) {
            setItems(initialItems);
        } else {
            const filteredItems = initialItems.filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
            );
            setItems(filteredItems);
        }
    };

    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const totalCount = items.length;

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        const permissionNameToValue = {
            view: UserPermission.View,
            edit: UserPermission.Edit,
            comment: UserPermission.Comment,
            create: UserPermission.Create,
        };

        const allNull = Object.values(checked).every((value) => value === null);

        let userPermissions: number[] = [];
        Object.keys(checked)
            .filter((key) => {
                return permissionNameToValue.hasOwnProperty(key);
            })
            .map((key) => {
                const permissionValue = permissionNameToValue[key as keyof typeof permissionNameToValue];

                if (checked[key as keyof typeof checked] === true) {
                    if (checked.comment === true) {
                        const permissionValue = UserPermission.Comment;
                        if (user && user.user_permissions && !user.user_permissions.includes(permissionValue)) {
                            user.user_permissions.push(permissionValue);
                            userPermissions = [...user?.user_permissions];
                        }
                    }
                    if (checked.create === true) {
                        const permissionValue = UserPermission.Create;
                        if (user && user.user_permissions && !user.user_permissions.includes(permissionValue)) {
                            user.user_permissions.push(permissionValue);
                            userPermissions = [...user?.user_permissions];
                        }
                    }
                    if (checked.edit === true) {
                        const permissionValue = UserPermission.Edit;
                        if (user && user.user_permissions && !user.user_permissions.includes(permissionValue)) {
                            user.user_permissions.push(permissionValue);
                            userPermissions = [...user?.user_permissions];
                        }
                    }
                    if (checked.view === true) {
                        const permissionValue = UserPermission.View;
                        if (user && user.user_permissions && !user.user_permissions.includes(permissionValue)) {
                            user.user_permissions.push(permissionValue);
                            userPermissions = [...user?.user_permissions];
                        }
                    }

                } else if (checked[key as keyof typeof checked] === false) {
                    if (checked.comment === false) {
                        const permissionValue = UserPermission.Comment;
                        if (user) {
                            if (user.user_permissions) {
                                user.user_permissions = user.user_permissions.filter(value => value !== permissionValue);
                                userPermissions = [...user?.user_permissions];
                            }
                        }

                    }
                    if (checked.create === false) {
                        const permissionValue = UserPermission.Create;
                        if (user) {
                            if (user.user_permissions) {
                                user.user_permissions = user.user_permissions.filter(value => value !== permissionValue);
                                userPermissions = [...user?.user_permissions];
                            }
                        }
                    }
                    if (checked.edit === false) {
                        const permissionValue = UserPermission.Edit;
                        if (user) {
                            if (user.user_permissions) {
                                user.user_permissions = user.user_permissions.filter(value => value !== permissionValue);
                                userPermissions = [...user?.user_permissions];
                            }
                        }
                    }
                    if (checked.view === false) {
                        const permissionValue = UserPermission.View;
                        if (user) {
                            if (user.user_permissions) {
                                user.user_permissions = user.user_permissions.filter(value => value !== permissionValue);
                                userPermissions = [...user?.user_permissions];
                            }
                        }
                    }
                }
                else if (allNull) {
                    userPermissions = user?.user_permissions || [];
                }

                return permissionValue;
            });

        const formattedData = {
            first_name: data.firstName,
            last_name: data?.lastName || '',
            password: data.createPassword,
            email: data.email,
            is_superuser: data.selectedType.value === 'admin' ? true : undefined,
            is_staff: data.selectedType.value === 'staff' ? true : undefined,
            user_permissions: userPermissions,
        };

        if (!openEditModal) {
            const userRequest = await createUser(formattedData);
            if (userRequest?.id) {
                toast.success('The user has been successfully created', {
                    position: 'top-right',
                    autoClose: 3000,
                    className: 'my-custom-toast',
                    style: myCustomStyles,
                    progressClassName: 'my-custom-progress-bar',
                    progressStyle: progressBarStyles,
                    icon: <CustomCheckmark />,
                });
                handleClose();
                setIsLoading(false)
            } else {
                toast.error('Something goes wrong...', {
                    position: 'top-right',
                    autoClose: 3000,
                    className: 'my-custom-toast-error',
                    style: myCustomStyles,
                    progressClassName: 'my-custom-progress-bar',
                    progressStyle: progressBarStyles,
                    icon: <CustomErrorIcon />,
                });
                setIsLoading(false);
            }
        } else {
            if (user?.id) {
                const data = await editUserById(formattedData, user?.id);

                if (data.message == 'User info and permissions updated.') {
                    toast.success('The user has been successfully updated', {
                        position: 'top-right',
                        autoClose: 3000,
                        className: 'my-custom-toast',
                        style: myCustomStyles,
                        progressClassName: 'my-custom-progress-bar',
                        progressStyle: progressBarStyles,
                        icon: <CustomCheckmark />,
                    });
                    setIsLoading(false);
                    handleCloseEditModal();
                }
                else {
                    toast.error('Something goes wrong...', {
                        position: 'top-right',
                        autoClose: 3000,
                        className: 'my-custom-toast-error',
                        style: myCustomStyles,
                        progressClassName: 'my-custom-progress-bar',
                        progressStyle: progressBarStyles,
                        icon: <CustomErrorIcon />,
                    });
                    setIsLoading(false);
                }
            }
        }
    };

    return (
        <Modal
            open={openModal || openEditModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'inline-flex',
                padding: '10px',
                flexDirection: 'column',
                gap: '8px',
                borderRadius: '4px',
                background: 'var(--text-color-10, #FFF)',
                boxShadow: '1px 4px 15px 4px rgba(0, 0, 0, 0.10)',
                border: 'none',
            }}>

                {(openEditModal && userByIdLoading) ?
                    <div>Loading...</div> :
                    <div className={styles.wrapper}>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className={styles.descriptionWrapper} style={{ marginTop: '8px' }}>
                                <p className={styles.descriptionText}>1. Admin Users have full rights over the platform.</p>
                                <p className={styles.descriptionText}>2. Staff Users have full rights over the platform by default, but rights can be restricted by the Admin Users.</p>
                                <p className={styles.descriptionText}>3. Clients have no rights over the platform by default, but rights can be assigned by Admin and Staff Users for each company.</p>
                            </div>

                            <div className={styles.dropDownWrapper} style={{ marginTop: '8px' }}>
                                <p className={styles.titleType}>Type</p>
                                <Controller
                                    name="selectedType"
                                    control={control}
                                    // defaultValue={null}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={typeOptions}
                                            styles={customStyles}
                                            value={selectedType}
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption);
                                                handleTypeChange(selectedOption);
                                            }}
                                            placeholder="Select type"
                                        />
                                    )}
                                />
                            </div>

                            <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                                <label className={styles.label} htmlFor="firstName">First Name</label>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    rules={{
                                        required: 'First name is required',
                                    }}
                                    render={({ field }) => (
                                        <input
                                            className={styles.input}
                                            type="text"
                                            placeholder="First name"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                            </div>

                            <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                                <label className={styles.label} htmlFor="email">Email</label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'Email is required',
                                    }}
                                    render={({ field }) => (
                                        <input
                                            className={styles.input}
                                            type="text"
                                            placeholder="Enter Email"
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                            </div>

                            <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                                <Controller
                                    name="createPassword"
                                    control={control}
                                    rules={{
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                    }}
                                    render={({ field }) => (
                                        <div className={styles.inputWrapper}>
                                            <label className={styles.label} htmlFor="createPassword">Create New Password</label>
                                            <div className={styles.passInptWrapper}>
                                                <input
                                                    className={styles.input}
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Enter Password"
                                                    id="createPassword"
                                                    {...field}
                                                />
                                                {errors.createPassword && <span className={styles.error}>{errors.createPassword.message}</span>}
                                                <div className={styles.iconWrapper}>
                                                    <img
                                                        alt="icon"
                                                        src={icon}
                                                        className={styles.eyeIcon}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className={styles.inputWrapper} style={{ marginTop: '8px' }}>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{
                                        required: 'Password is required',
                                        minLength: { value: 8, message: 'Password must be at least 8 characters' },
                                    }}
                                    render={({ field }) => (
                                        <div className={styles.inputWrapper}>
                                            <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                                            <div className={styles.passInptWrapper}>
                                                <input
                                                    id="confirmPassword"
                                                    className={styles.input}
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Enter Password"
                                                    {...field}
                                                />
                                                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}
                                                <div className={styles.iconWrapper}>
                                                    <img
                                                        alt="icon"
                                                        src={icon}
                                                        className={styles.eyeIcon}
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className={styles.permissionsWrapper} style={{ marginTop: '8px' }}>
                                <div className={styles.permissionTitle}>
                                    <p className={styles.label}>Permission</p>
                                    <div className={styles.checkBoxesWrapper}>
                                        <Controller
                                            name="view"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControlLabel
                                                    className={styles.checkBoxWrapper}
                                                    control={
                                                        <Checkbox
                                                            defaultChecked={user ? user?.user_permissions?.includes(53) : checked.view || false}
                                                            // defaultChecked={user?.user_permissions?.includes(53)}
                                                            className={styles.customCheckBox}
                                                            onChange={handleChange}
                                                            style={{ padding: 0, marginRight: 4 }}
                                                            name="view"
                                                            sx={{
                                                                '&.Mui-checked': {
                                                                    color: 'rgba(85, 110, 230, 1)',
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    width: '10px',
                                                                    height: '10px',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <img alt='view' src={eye} className={styles.inputImg} />
                                                            <p className={styles.inputName}>View</p>
                                                        </div>
                                                    }
                                                />

                                            )}
                                        />

                                        <Controller
                                            name="edit"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControlLabel
                                                    className={styles.checkBoxWrapper}
                                                    control={
                                                        <Checkbox
                                                            defaultChecked={user ? user?.user_permissions?.includes(54) : checked.view || false}
                                                            // defaultChecked={user?.user_permissions?.includes(54)}
                                                            className={styles.customCheckBox}
                                                            onChange={handleChange}
                                                            style={{ padding: 0 }}
                                                            name="edit"
                                                            sx={{
                                                                '&.Mui-checked': {
                                                                    color: 'rgba(85, 110, 230, 1)',
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    width: '10px',
                                                                    height: '10px',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <img alt='view' src={edit} className={styles.inputImg} />
                                                            <p className={styles.inputName}>Edit</p>
                                                        </div>
                                                    }
                                                />
                                            )}
                                        />

                                        <Controller
                                            name="comment"
                                            control={control}
                                            render={({ field }) => (

                                                <FormControlLabel
                                                    className={styles.checkBoxWrapper}
                                                    control={
                                                        <Checkbox
                                                            defaultChecked={user ? user?.user_permissions?.includes(55) : checked.view || false}
                                                            // defaultChecked={user?.user_permissions?.includes(55)}
                                                            className={styles.customCheckBox}
                                                            onChange={handleChange}
                                                            style={{ padding: 0 }}
                                                            name="comment"
                                                            sx={{
                                                                '&.Mui-checked': {
                                                                    color: 'rgba(85, 110, 230, 1)',
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    width: '10px',
                                                                    height: '10px',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <img alt='view' src={comment} className={styles.inputImg} />
                                                            <p className={styles.inputName}>Comment</p>
                                                        </div>
                                                    }
                                                />

                                            )}
                                        />

                                        <Controller
                                            name="create"
                                            control={control}
                                            render={({ field }) => (

                                                <FormControlLabel
                                                    className={styles.checkBoxWrapper}
                                                    control={
                                                        <Checkbox
                                                            defaultChecked={user ? user?.user_permissions?.includes(56) : checked.view || false}
                                                            // defaultChecked={user?.user_permissions?.includes(56)}
                                                            className={styles.customCheckBox}
                                                            onChange={handleChange}
                                                            style={{ padding: 0 }}
                                                            name="create"
                                                            sx={{
                                                                '&.Mui-checked': {
                                                                    color: 'rgba(85, 110, 230, 1)',
                                                                },
                                                                '& .MuiSvgIcon-root': {
                                                                    width: '10px',
                                                                    height: '10px',
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <img alt='view' src={plus} className={styles.inputImg} />
                                                            <p className={styles.inputName}>Create New</p>
                                                        </div>
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className={styles.searchInputWrapper}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className={styles.inputSearch}
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                    />

                                    <img src={searchIcon} alt="Search Icon" className={styles.searchIcon} />
                                </div>

                                <div className={styles.pagestPermissionWrapper}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--text-color-50, #EFF2F7)', width: '100%', padding: '4px 7px;', marginRight: '8px' }}>
                                        <Checkbox
                                            checked={selectAll}
                                            className={styles.customCheckBox}
                                            onChange={handleSelectAllChange}
                                            sx={{
                                                '&.Mui-checked': {
                                                    color: 'rgba(85, 110, 230, 1)',
                                                },
                                                '& .MuiSvgIcon-root': {
                                                    width: '10px',
                                                    height: '10px',
                                                },
                                            }}
                                        />
                                        <span className={styles.countChecked}>{checkedCount}/{totalCount} Selected</span>
                                    </Box>
                                    <div className={styles.itemsWrapper}>
                                        {items.map((item) => (
                                            <div key={item.id} className={styles.permissionToChoseWrapper}>
                                                <Checkbox
                                                    className={styles.customCheckBox}
                                                    sx={{
                                                        '&.Mui-checked': {
                                                            color: 'rgba(85, 110, 230, 1)',
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            width: '10px',
                                                            height: '10px',
                                                        },
                                                    }}
                                                    checked={checkedItems[item.id] || false}
                                                    onChange={() => handleCheckboxChange(item.id)}
                                                />
                                                <span className={styles.label} style={{ fontWeight: '400' }}>{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.btnWrapper} style={{ marginTop: '8px' }}>
                                <button className={styles.modalBtn} onClick={handleCloseModal}>Cancel</button>
                                <button className={styles.modalBtn} type='submit'>{isLoading ? <CircleLoader loading={isLoading} color={'#FFF'} size={10} /> : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                }


            </Box>
        </Modal >
    )
}
