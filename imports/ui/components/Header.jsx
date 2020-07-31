import React, { useState, useEffect } from 'react'
import { Route } from 'react-router'
import { Toolbar, Icon, ToolbarButton, Select } from 'react-onsenui'
import i18n from 'meteor/universe:i18n'; // <--- 1
import { useCookies } from 'react-cookie';

function Header({ show, history }) {
    const [currentLanguage, setCurrentLanguage] = useState();
    const [language, setLanguage] = useCookies(['language']);
    function renderLanguageList() {
        return i18n.getLanguages().map((lang) => {
            return <option key={lang} value={lang}>{lang}</option>
        })
    }

    function getLanguage(){
        if(language.language != undefined){
            return language.language
        }
        return i18n.getLocale();
    }

    useEffect(() => {
        i18n.setLocale(language.language);
        setCurrentLanguage(getLanguage())
    }, [])

    return (
        <Toolbar>
            <div className="left" style={{ display: 'flex', alignItems: 'center', fontSize: '1.25em', fontWeight: 'bold' }}>
                <Route render={({ history }) => (
                    <img src='/images/logo.png' onClick={() => { history.push('/') }} style={{ height: "40px", maxWidth: "100%", padding: "0 15px" }}></img>
                )} />
                How Long is the Line?
            </div>
            <div className="right">
                <ToolbarButton >
                    <Icon icon="md-translate" />
                </ToolbarButton>

                <Select modifier="material"
                    value={currentLanguage}
                    onChange={(event) => {
                        i18n.setLocale(event.target.value);
                        setCurrentLanguage(event.target.value);
                        setLanguage('language',event.target.value)
                    }}>
                    {/* {renderLanguageList()} */}
                    <option key="en" value="en">English</option>
                    <option key="zh" value="zh">中文</option>
                </Select>
                <ToolbarButton onClick={show}>
                    <Icon icon="bars" />
                </ToolbarButton>
            </div>
        </Toolbar>
    )
}

export default Header;