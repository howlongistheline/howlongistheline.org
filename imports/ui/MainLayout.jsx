import React, { useState, useEffect } from 'react'
import { Route } from 'react-router'
import { Page } from 'react-onsenui'
import * as Ons from 'react-onsenui'
import Header from './components/Header'
import i18n from 'meteor/universe:i18n'; // <--- 1

const T = i18n.createComponent(i18n.createTranslator('mainlayout'));

function SideBar({ children, history }) {
    const [isOpen, setIsOpen] = useState(false);
    function hide() {
        setIsOpen(false)
    }
    function show() {
        setIsOpen(true)
    }


    function loadPage(history, page) {
        hide()
        history.push(page)
    }
    return (<>
        <Ons.Splitter>
            <Ons.SplitterSide side='right' width={220} collapse={true} swipeable={false} isOpen={isOpen} onClose={hide} onOpen={show}>
                <Ons.Page>
                    <Ons.List>
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { loadPage(history, "/") }} tappable><T>home</T></Ons.ListItem>
                        )} />
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { loadPage(history, "/faq") }} tappable><T>faq</T></Ons.ListItem>
                        )} />
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { window.open("https://github.com/howlongistheline/howlongistheline.org") }} tappable><T>sourceCode</T></Ons.ListItem>
                        )} />
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { loadPage(history, "/learntocode") }} tappable><T>learnToCode</T></Ons.ListItem>
                        )} />
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { window.open("https://www.facebook.com/groups/1161156860891990/") }} tappable><T>fb</T></Ons.ListItem>
                        )} />
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { loadPage(history, "/feedback") }} tappable><T>contact</T></Ons.ListItem>
                        )} />

                    </Ons.List>
                </Ons.Page>
            </Ons.SplitterSide>
            <Ons.SplitterContent>
                {/* {React.cloneElement(children, { showMenu: show })} */}
                <Page renderToolbar={() =>
                    <Header show={show}/>
                }
                >
                    {children}
                </Page>
            </Ons.SplitterContent>
        </Ons.Splitter>
    </>)
}

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export default SideBar
