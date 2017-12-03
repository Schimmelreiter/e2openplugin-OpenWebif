from time import localtime, strftime
from urllib import quote
from Plugins.Extensions.OpenWebif.local import tstrings

class renderEvtBlock:

	def __init__(self):
		self.template = '\n\t\t<div class="event" data-ref="%s" data-id="%s" data-toggle="modal" data-target="#EventModal" onClick="loadeventepg(\'%s\', \'%s\');return false;">\n\t\t\t<div style="width:40px; float:left; padding: 0 3px">%s%s</div>\n\t\t\t<div style="width:144px; float:left">\n\t\t\t\t<div class="title">%s</div>%s\n\t\t\t</div>\n\t\t\t<div style="clear:left"></div>\n\t\t</div>\n\t\t'

	def render(self, event):
		if event['title'] != event['shortdesc']:
			shortdesc = '<div class="desc">%s</div>' % event['shortdesc']
		else:
			shortdesc = ''
		if event['timerStatus'] != '':
			timerEventSymbol = '<div class="%s">%s</div>' % (event['timerStatus'], tstrings['timer'])
		else:
			timerEventSymbol = ''
		return self.template % (quote(event['ref'], safe=" ~@#$&()*!+=:;,.?/'"),
		 event['id'],
		 event['id'],
		 quote(event['ref'], safe=" ~@#$&()*!+=:;,.?/'"),
		 strftime('%H:%M', localtime(event['begin_timestamp'])),
		 timerEventSymbol,
		 event['title'],
		 shortdesc)