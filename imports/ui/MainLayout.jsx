import React, { useState, useEffect } from 'react'
import { Route } from 'react-router'
import { Page, Toolbar, Icon, ToolbarButton } from 'react-onsenui'
import * as Ons from 'react-onsenui'

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
            <Ons.SplitterSide side='left' width={220} collapse={true} swipeable={false} isOpen={isOpen} onClose={hide} onOpen={show}>
                <Ons.Page>
                    <Ons.List>
                        <Route render={({ history }) => (
                            <Ons.ListItem key={"MAIN_PAGE"} onClick={() => { loadPage(history, "/") }} tappable>Home</Ons.ListItem>
                        )} />
                    </Ons.List>
                </Ons.Page>
            </Ons.SplitterSide>
            <Ons.SplitterContent>
                {/* {React.cloneElement(children, { showMenu: show })} */}
                <Page renderToolbar={() =>
                    <Toolbar>
                        <div className="left">
                            <ToolbarButton onClick={() => {
                                show()
                            }}>
                                <Icon icon="bars" />
                            </ToolbarButton>
                        </div>
                        <div className="center">
                        {/* <Route render={({ history }) => (
                            <img src='/images/...' onClick={() => { loadPage(history, "/") }}style={{height:"80%", maxWidth:"100%"}}></img>
                        )} /> */}
                        Header
                        </div>
                        <div className="right">
                        <Route render={({ history }) => (
                                                <ToolbarButton onClick={() => {
                                                    // loadPage(history, '/profile')
                                                }}>
                                                    <Icon icon="fa-user-circle" />
                                                </ToolbarButton>   
                        )} />

                        </div>
                    </Toolbar>}
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
