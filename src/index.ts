import arg from 'arg'

import {parseI18nFromConfluence} from './lib'
import {OutputFileFormat} from 'types'

const parseArgumentsIntoOptions = (rawArgs: string[]) => {
	const args = arg(
		{
			'--domain': String,
			'--pageid': String,
			'--username': String,
			'--password': String,
			'--typescript': Boolean,
			'--json': Boolean,
			'--outputdir': String,
			'--noEmpty': Boolean,
			'-d': '--domain',
			'-i': '--pageid',
			'-u': '--username',
			'-p': '--password',
			'-t': '--typescript',
			'-j': '--json',
			'-o': '--outputdir',
		},
		{
			argv: rawArgs.slice(2),
		}
	)

	if (Boolean(args['--typescript']) && Boolean(args['--json'])) {
		throw new Error('The flags -t and -j are mutually exclusive. Provide either one or the other, or none.')
	}

	return {
		domain: args['--domain'],
		pageId: args['--pageid'],
		username: args['--username'],
		password: args['--password'],
		outputFileFormat: Boolean(args['--json'])
			? 'json'
			: Boolean(args['--typescript'])
			? 'ts'
			: ('js' as OutputFileFormat),
		outputDir: args['--outputdir'] || '.',
		noEmptyValues: Boolean(args['--noEmpty']),
	}
}

export const cli = (args: string[]) => {
	const options = parseArgumentsIntoOptions(args)

	parseI18nFromConfluence(
		options.domain,
		options.pageId,
		options.username,
		options.password,
		options.outputFileFormat,
		options.noEmptyValues,
		options.outputDir
	)
		.then(() => console.log('Successfully written i18n files'))
		.catch((err) => console.error('Error while parsing i18n from Confluence', err))
}
