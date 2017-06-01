

const express = require("express");
const mongoose = require("mongoose");

module.exports =  function(){
    mongoose.connect("mongodb://localhost/testing_db");

    const dbConnection = mongoose.connection;


    dbConnection.on("error",console.log.bind(console, "connection error : "));

    dbConnection.once("open",()=>{
        console.log("connection successfully");
    })
};