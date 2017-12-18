#!/bin/bash
dd if=$1 of=$2 && sudo -u $USER zenity --info --text="USB number $3 is done." --title="lugFreestyle"
