#!/bin/python3

import secrets;
import sys;


# def prompt_token(t):
#     try:
#         return int(input("Enter Length for "+t+" Token: "))
#     except:
#         print("not a number")
#         prompt_token(t)


# AT_INPUT = prompt_token("Access Token");
# RT_INPUT = prompt_token("Refresh Token")

def gen_token():
    try:
        f = open('.env', 'a')
        f.write(
            "\n### GENERATED BY gen_secrets.py ###" +
            "\nACCESS_TOKEN_SECRET=" + secrets.token_hex(256) +
            "\nREFRESH_TOKEN_SECRET=" + secrets.token_hex(256)
        )
        print('secrets appended')
    except:
        exit("Failed to generate tokens")

def verify():
    user_input = input("Are you sure? [y/N] ").lower()
    if (user_input == 'y'):
        gen_token()
    else:
        exit('Aborting...')

verify()

