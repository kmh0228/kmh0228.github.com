package com.bjst.server;

import com.bjst.impl.UserImpl;
import com.bjst.model.User;
import com.bjst.userDao.UserDao;

public class Userserver {


        public UserDao userDao = new UserImpl();

        public void add(User u){
            this.userDao.save(u);
        }


}
