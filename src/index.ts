import { Context, Schema, Universal, h } from 'koishi'
import { } from '@koishijs/plugin-help'

export const name = 'rua'

export interface Config {
  commands: string[]
  hidden: boolean
}

export const Config: Schema<Config> = Schema.object({
  commands: Schema.array(String).role('table').description('指令列表').default(['rua', '敲']),
  hidden: Schema.boolean().description('是否在 help 菜单中隐藏指令').default(false)
})

function getUserName(event: Universal.Message) {
  const author = {
    ...event.user,
    ...event.member
  }
  return author.nick || author.name || author.id
}

export function apply(ctx: Context, cfg: Config) {
  for (const name of cfg.commands) {
    const action = name.trim()
    if (!action) continue
    ctx.command(action, { hidden: cfg.hidden })
      .action(async ({ session }, addition) => {
        let source = session.username, target: string
        if (session.quote) {
          target = getUserName(session.quote)
        }
        let content = `${h.quote(session.messageId)}<b>${source}</b> ${action}了 `
        /*if (addition) {
          content += addition.startsWith('的') ? '' : '了'
        } else {
          content += '了'
        }*/
        content += target ? `<b>${target}</b> ` : '自己'
        //content += addition || ''
        return content + '！'
      })
  }
}