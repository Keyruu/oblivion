// @ts-ignore
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/comments.scss"
import script from "./scripts/giscus.inline"

const Comments: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <section class={`${displayClass ?? "comments"}`}>
      <div class="giscus">
      </div>
    </section>
  )
}

Comments.afterDOMLoaded = script
Comments.css = style

export default (() => Comments) satisfies QuartzComponentConstructor
