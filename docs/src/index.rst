WebJive
==============================================

Description
=====

With this device explorer built on TangoGQL, you can:

1. View a list of all Tango devices
2. View and modify device properties
3. View and modify device attributes
4. View and execute device commands
5. Create web interfaces for interacting with Tango devices (on /&lt;tangoDB&gt;/dashboard)

Usage
=====

1. Clone the repository.

2. Run 

.. code-block:: bash

 npm install


3. Type 

.. code-block:: bash

 npm start


Minimum node version: 7.6 (introduced async/wait)

Verified working node version: 9.11.2 (currently used by the dockerfile)

Online demo
=====

https://webjive-demo.maxiv.lu.se/demodb (log in with demo/demo)

For developers
=====

.. toctree::
    widget
    architecture
    led
    command_writer

Authors
=====

WebJive was written by the KITS Group at MAX IV Laboratory .



.. toctree::
   :maxdepth: 2
   :caption: Contents:

   widget
   architecture
   led
   command_writer


Prerequsities
-------------

To use this project, Docker >= v18 and GNU Make must be installed.

