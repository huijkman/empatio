#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
from google.appengine.ext.webapp import template
import os

class MainHandler(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'empatio-site/index.html')
        template_values = {
        }
        self.response.out.write(template.render(path, template_values))

class MainHandlerNL(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'empatio-site/index-nl.html')
        template_values = {
        }
        self.response.out.write(template.render(path, template_values))

class TimHandler(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'empatio-site/tim.html')
        template_values = {
        }
        self.response.out.write(template.render(path, template_values))

class TimHandlerNL(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'empatio-site/tim-nl.html')
        template_values = {
        }
        self.response.out.write(template.render(path, template_values))

class ArendHandler(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'empatio-site/arend.html')
        template_values = {
        }
        self.response.out.write(template.render(path, template_values))

class ArendHandlerNL(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'empatio-site/arend-nl.html')
        template_values = {
        }
        self.response.out.write(template.render(path, template_values))

class BumperHandler(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'empatio-site/bumper.html')
        template_values = {
        }
        self.response.out.write(template.render(path, template_values))

app = webapp2.WSGIApplication([
    ('/', BumperHandler),
    ('/dev', MainHandler),
    ('/tim', TimHandler),
    ('/arend', ArendHandler),
    ('/dev/nl', MainHandlerNL),
    ('/nl/tim', TimHandlerNL),
    ('/nl/arend', ArendHandlerNL)
], debug=True)
