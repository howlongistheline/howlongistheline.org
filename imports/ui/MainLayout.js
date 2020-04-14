import React, { useState, useEffect } from 'react';
import { Route } from 'react-router';
import { Page, Toolbar, Icon, ToolbarButton } from 'react-onsenui';
import * as Ons from 'react-onsenui';
import moment from 'moment';

function SideBar({ children, history }) {
  const [isOpen, setIsOpen] = useState(false);
  function hide() {
    setIsOpen(false);
  }
  function show() {
    setIsOpen(true);
  }

  function loadPage(history, page) {
    hide();
    history.push(page);
  }
  return (
    <React.Fragment>
      <Ons.Splitter>
        <Ons.SplitterSide
          side="left"
          width={220}
          collapse
          swipeable={false}
          isOpen={isOpen}
          onClose={hide}
          onOpen={show}
        >
          <Ons.Page>
            <Ons.List>
              <Route
                render={({ history }) => (
                  <Ons.ListItem
                    key="MAIN_PAGE"
                    onClick={() => {
                      loadPage(history, '/');
                    }}
                    tappable
                  >
                    HOME
                  </Ons.ListItem>
                )}
              />
              <Route
                render={({ history }) => (
                  <Ons.ListItem
                    key="MAIN_PAGE"
                    onClick={() => {
                      loadPage(history, '/faq');
                    }}
                    tappable
                  >
                    FAQ
                  </Ons.ListItem>
                )}
              />
              <Route
                render={({ history }) => (
                  <Ons.ListItem
                    key="MAIN_PAGE"
                    onClick={() => {
                      window.open(
                        'https://github.com/howlongistheline/howlongistheline.org',
                      );
                    }}
                    tappable
                  >
                    SOURCE CODE
                  </Ons.ListItem>
                )}
              />
              <Route
                render={({ history }) => (
                  <Ons.ListItem
                    key="MAIN_PAGE"
                    onClick={() => {
                      loadPage(history, '/learntocode');
                    }}
                    tappable
                  >
                    LEARN TO CODE
                  </Ons.ListItem>
                )}
              />
              <Route
                render={({ history }) => (
                  <Ons.ListItem
                    key="MAIN_PAGE"
                    onClick={() => {
                      window.open(
                        'https://www.facebook.com/groups/1161156860891990/',
                      );
                    }}
                    tappable
                  >
                    FACEBOOK GROUP
                  </Ons.ListItem>
                )}
              />
              <Route
                render={({ history }) => (
                  <Ons.ListItem
                    key="MAIN_PAGE"
                    onClick={() => {
                      loadPage(history, '/feedback');
                    }}
                    tappable
                  >
                    CONTACT
                  </Ons.ListItem>
                )}
              />
            </Ons.List>
          </Ons.Page>
        </Ons.SplitterSide>
        <Ons.SplitterContent>
          {/* {React.cloneElement(children, { showMenu: show })} */}
          <Page
            renderToolbar={() => (
              <Toolbar>
                <div className="left">
                  <ToolbarButton
                    onClick={() => {
                      show();
                    }}
                  >
                    <Icon icon="bars" />
                  </ToolbarButton>
                </div>
                <div className="center">
                  {/* <Route render={({ history }) => (
                            <img src='/images/...' onClick={() => { loadPage(history, "/") }}style={{height:"80%", maxWidth:"100%"}}></img>
                        )} /> */}
                  How Long is the Line?
                </div>

                <div className="right" />
              </Toolbar>
            )}
          >
            {children}
          </Page>
        </Ons.SplitterContent>
      </Ons.Splitter>
    </React.Fragment>
  );
}

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// }

export default SideBar;
