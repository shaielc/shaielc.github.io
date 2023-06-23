import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { fetchAvailableNotebooks, notebookSource, IFileInfo } from './externalSources';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import React from 'react';


// Copied from https://mui.com/material-ui/guides/routing/
const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} relative='path'/>;
});

export function MenuOptions({closeDrawer}: {closeDrawer: ()=>void}) {
    const [items, setItemList] = useState(<List></List>)
    useEffect( () => {
    fetchAvailableNotebooks(notebookSource['jupyter-utility-widgets'].list).then((files) => {
        const elements = files.map((item) =>{
            console.log(item)
            return (
            <ListItem key={item.name} >
                <ListItemButton  LinkComponent={LinkBehavior} href={`/site/nb/${item.name}`} onClick={closeDrawer}>
                    {item.name}
                </ListItemButton>
            </ListItem>
            )
        })
        setItemList(
            <List>
                {elements}
            </List>
        )
    })}, []);
    return (
        <Box >
            {items}
        </Box>
    )
}


export function AppMenu() {
    const [isOpen, setOpen] = useState(false)

    function toggleDrawer(state: boolean) {
        setOpen(state)
    }

    return <div><IconButton onClick={() => toggleDrawer(true)}>
        <MenuIcon color='primary' />
    </IconButton>
        <Drawer anchor='left' open={isOpen} onClose={() => toggleDrawer(false)}>
            <MenuOptions closeDrawer={() => toggleDrawer(false)}></MenuOptions>
        </Drawer>
    </div>
}