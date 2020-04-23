import React from 'react'
import { Route } from 'react-router'
import { Toolbar, Icon, ToolbarButton } from 'react-onsenui'

function Header({ show, history }) {
    return (
        <Toolbar>
            <div className="left" style={{ display: 'flex', alignItems: 'center', fontSize: '1.25em', fontWeight: 'bold' }}>
                <Route render={({ history }) => (
                    <img src='/images/logo.png' onClick={() => { history.push('/') }} style={{ height: "40px", maxWidth: "100%", padding: "0 15px" }}></img>
                )} />
                How Long is the Line?
            </div>
            <div className="right">
                <ToolbarButton onClick={show}>
                    <Icon icon="bars" />
                </ToolbarButton>
            </div>
        </Toolbar>
    )
}

export default Header;