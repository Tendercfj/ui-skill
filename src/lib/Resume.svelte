<script lang="ts">
  import { ArrowDown, ArrowUpRight, Bot, Check, Code2, Copy, Mail, MapPin, PackageCheck, Phone, Sparkles } from '@lucide/svelte';
  import { resume } from './resume';

  let copyStatus = $state('');

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      copyStatus = `${label}已复制`;
    } catch {
      copyStatus = `请手动复制${label}`;
    }
  }
</script>

<div class="resume-shell">
  <a class="skip-link" href="#skills">跳转到简历正文</a>

  <header class="resume-header wrap">
    <a class="identity" href="#overview" aria-label={`${resume.name}简历概览`}><span>CFJ</span><b>.</b><small>{resume.englishName}</small></a>
    <nav class="resume-nav" aria-label="简历导航">
      <a href="#skills">技能</a><a href="#projects">项目</a><a href="#experience">经历</a>
    </nav>
    <div class="header-right">
      <span class="header-status"><i></i>AI FULL-STACK / HANGZHOU</span>
      <a class="header-contact" href="#contact">联系我 <ArrowUpRight size={12} /></a>
    </div>
  </header>

  <section id="overview" class="hero wrap" aria-labelledby="profile-name">
    <div class="hero-copy">
      <p class="section-kicker"><span class="accent-line"></span> AI-ASSISTED PRODUCT DELIVERY</p>
      <h1 id="profile-name"><span>AI 全栈开发</span><span>工程师<em>.</em></span></h1>
      <p class="hero-intro">{resume.intro}</p>
      <div class="hero-meta"><span><MapPin size={13} />{resume.location}</span><span class="meta-divider"></span><span>软件工程硕士</span><span class="meta-divider"></span><span>全栈协作</span></div>
      <div class="hero-actions"><a class="primary-action" href="#projects">查看项目交付 <ArrowUpRight size={16} /></a><a class="text-action" href="#skills">浏览技能栈 <ArrowDown size={15} /></a></div>
      <p class="availability"><span></span>{resume.availability}<b> / AI FULL-STACK DEVELOPMENT</b></p>
    </div>

    <div class="hero-stats" aria-label="关键数字">
      <article><strong>03</strong><span>精选项目</span></article>
      <article><strong>04</strong><span>核心领域</span></article>
      <article><strong>∞</strong><span>持续交付</span></article>
    </div>

    <div class="hero-flow" aria-label="AI 辅助到需求交付的工作流程">
      <div class="flow-topline"><span>WORKFLOW / 01—03</span><span>AI × CODE × DELIVERY</span></div>
      <div class="flow-stack">
        {#each resume.workflow as step, index}
          <div class="flow-mini" class:flow-active={index === 0}>
            <span class="flow-number">{step.number}</span>
            <div><strong>{step.label}</strong><small>{step.accent}</small></div>
            <ArrowUpRight size={15} />
          </div>
        {/each}
      </div>
      <p class="flow-note">把 AI 当作协作者，把代码当作执行力，把交付当作结果。</p>
    </div>

    <div class="hero-footnote"><span>从问题出发，直到需求被验证。</span><a href="#skills">向下探索 <ArrowDown size={13} /></a></div>
  </section>

  <div class="resume-details">
    <section id="skills" class="detail-section skills-section wrap" aria-labelledby="skills-title">
      <div class="section-heading"><div><p class="section-kicker">01 / SKILLS</p><h2 id="skills-title">技能是方法，<br /><span>AI 是加速器。</span></h2></div><p class="section-aside">从智能工作流到前后端工程，覆盖一次真实需求的完整路径。</p></div>
      <div class="skill-grid">
        {#each resume.skills as skill, index}
          <article class="skill-card" class:skill-primary={index === 0}>
            <div class="skill-card-top"><span>0{index + 1}</span><Sparkles size={15} /></div>
            <h3>{skill.title}</h3><p>{skill.note}</p>
            <ul>{#each skill.items as item}<li>{item}</li>{/each}</ul>
          </article>
        {/each}
      </div>
    </section>

    <section id="projects" class="detail-section project-section wrap" aria-labelledby="projects-title">
      <div class="section-heading horizontal-heading"><div><p class="section-kicker">02 / PROJECTS</p><h2 id="projects-title">把想法，<span>做成可交付的功能。</span></h2></div><p class="section-aside">{resume.projects.length} 个精选项目 / AI 辅助 × 全栈实现 × 业务交付</p></div>
      {#each resume.projects as project, index}
        <article id={project.id} class="project-feature">
          <div class="project-index">0{index + 1}<span>SELECTED</span></div>
          <div class="project-main">
            <div class="project-type">{project.type}{#if project.period}<span>{project.period}</span>{/if}</div>
            <h3>{project.name}</h3>
            <p class="project-description">{project.description}</p>
            {#if project.url}<a class="project-link" href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`访问 ${project.name} 官网（新窗口）`}>访问官网 <ArrowUpRight size={14} /></a>{/if}
            <div class="project-stack"><span>STACK</span>{project.stack}</div>
            <ul class="project-highlights">{#each project.highlights as item}<li>{item}</li>{/each}</ul>
            <div class="tag-list">{#each project.tags as tag}<span>{tag}</span>{/each}</div>
          </div>
          <div class="project-visual" aria-hidden="true"><div class="visual-grid"></div><div class="visual-orbit"></div><span>AI<br />↓<br />CODE<br />↓<br />DELIVERY</span></div>
        </article>
      {/each}
    </section>

    <section id="experience" class="detail-section experience-section wrap" aria-labelledby="experience-title">
      <div class="section-heading horizontal-heading"><div><p class="section-kicker">03 / EXPERIENCE</p><h2 id="experience-title">在业务现场，<span>完成需求交付。</span></h2></div><p class="section-aside">每一次迭代，都让 AI 辅助更靠近真实结果。</p></div>
      <div class="experience-list">
        {#each resume.experiences as experience, index}
          <article class="experience-row"><div class="experience-date"><span class="timeline-dot"></span><b>0{index + 1}</b>{experience.period}</div><div class="experience-body"><div class="experience-heading"><div><h3>{experience.organization}</h3><p>{experience.role}</p></div><span class="experience-arrow"><ArrowUpRight size={18} /></span></div><p class="experience-description">{experience.description}</p><ul>{#each experience.highlights as highlight}<li>{highlight}</li>{/each}</ul><div class="tag-list">{#each experience.tags as tag}<span>{tag}</span>{/each}</div></div></article>
        {/each}
      </div>
    </section>

    <section class="delivery-section wrap" aria-labelledby="delivery-title">
      <div class="delivery-head"><p class="section-kicker">DELIVERY LOOP</p><h2 id="delivery-title">一个清晰的工作闭环。</h2><p>每个阶段都有可验证的输出，让 AI 的速度服务于业务质量。</p></div>
      <div class="workflow-grid">{#each resume.workflow as step, index}<article><span class="workflow-icon">{#if index === 0}<Bot size={19} />{:else if index === 1}<Code2 size={19} />{:else}<PackageCheck size={19} />{/if}</span><span class="workflow-step">STEP {step.number}</span><h3>{step.label}</h3><p>{step.detail}</p></article>{/each}</div>
    </section>

    <section class="education-section wrap" aria-labelledby="education-title"><div class="section-heading"><p class="section-kicker">EDUCATION</p><h2 id="education-title">持续学习，<br />保持工程判断。</h2></div><div class="education-list">{#each resume.education as item}<article><div><h3>{item.school}</h3><p>{item.degree}</p></div><span>{item.period}</span><small>{item.detail}</small></article>{/each}</div></section>

    <section id="contact" class="contact-section wrap" aria-labelledby="contact-title"><p class="section-kicker">04 / CONTACT</p><div class="contact-heading"><h2 id="contact-title">把下一件事，<br /><span>交付得更好。</span></h2><ArrowUpRight size={46} strokeWidth={1} /></div><p class="contact-description">如果你正在寻找一位能把 AI 辅助、代码实现与业务交付串起来的开发者，欢迎联系我。</p><div class="contact-list"><a href={`mailto:${resume.email}`}><Mail size={16} /><span>{resume.email}</span><ArrowUpRight size={14} /></a><a href={`tel:${resume.phone}`}><Phone size={16} /><span>{resume.phone}</span><ArrowUpRight size={14} /></a><span class="contact-place"><MapPin size={16} />{resume.location}</span><button class="copy-contact" onclick={() => copyValue(resume.email, '邮箱')} aria-label="复制邮箱" title="复制邮箱">{#if copyStatus === '邮箱已复制'}<Check size={16} />{:else}<Copy size={16} />{/if}</button></div><p class="copy-status" role="status" aria-live="polite">{copyStatus}</p></section>

    <footer class="resume-footer wrap"><span>© 2026 {resume.englishName}</span><span>AI 辅助 / Coding / 需求交付</span><a href="#overview">返回顶部 <ArrowUpRight size={12} /></a></footer>
  </div>
</div>

<style>
  .project-main { min-width: 0; }
  .project-stack { overflow-wrap: anywhere; }
  .project-link { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; margin-top: 9px; color: #b5ddd1; font-size: 11px; }
  .wrap { max-width: 1360px; margin-inline: auto; padding-inline: 68px; }
  .resume-shell { --resume-muted: #9bb0bd; position: relative; padding-bottom: 108px; }
  .resume-shell::before { content: ''; position: absolute; inset: 0 0 auto; height: 100svh; z-index: -1; pointer-events: none; background: linear-gradient(90deg, #070b16ed 0%, #070b16cf 30%, #070b1642 63%, transparent 82%); }
  a { color: inherit; text-decoration: none; transition: color 180ms var(--ease), background 180ms var(--ease), border-color 180ms var(--ease), transform 180ms var(--ease); }
  a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 5px; }
  a:hover { color: var(--accent); }
  .skip-link { position: fixed; left: 20px; top: 15px; z-index: 30; padding: 12px 18px; background: #173936; color: #fff; transform: translateY(-200%); border-radius: 4px; }
  .skip-link:focus { transform: translateY(0); }
  .resume-header { display: grid; grid-template-columns: 1fr auto 1fr; gap: 28px; align-items: center; min-height: 116px; }
  .identity { display: flex; align-items: baseline; width: fit-content; min-height: 44px; font-size: 28px; letter-spacing: -1.6px; font-weight: 650; }
  .identity > span { color: var(--accent); }.identity b { color: #e8f5f2; }.identity small { margin-left: 17px; color: #9eb3c0; font-size: 8px; letter-spacing: 1.5px; font-weight: 450; }
  .resume-nav { display: flex; gap: 28px; }.resume-nav a { min-height: 44px; display: flex; align-items: center; gap: 5px; color: #b7c8d1; font-size: 11px; letter-spacing: .4px; }.resume-nav a:hover { color: var(--accent); }
  .header-status { justify-self: end; display: flex; align-items: center; gap: 8px; color: #9cb5c2; font-size: 8px; letter-spacing: 1.1px; }.header-status i { width: 5px; height: 5px; border-radius: 50%; background: #b7f36b; box-shadow: 0 0 10px #b7f36b; }
  .hero { position: relative; min-height: calc(100svh - 116px); display: flex; align-items: center; padding-block: 52px 136px; }.hero-copy { position: relative; isolation: isolate; max-width: 625px; }.hero-copy::before { content: ''; position: absolute; inset: -32px -28px; z-index: -1; background: linear-gradient(90deg, #070b16eb 0%, #070b16d6 80%, transparent); pointer-events: none; }
  .section-kicker { display: flex; align-items: center; gap: 12px; color: #9bb4c1; font-size: 9px; letter-spacing: 1.8px; }.accent-line { width: 25px; height: 1px; background: var(--accent); }.hero h1 { margin: 29px 0 20px; color: #f1f8fa; font-size: clamp(58px, 7.4vw, 100px); line-height: 1.08; letter-spacing: -5px; font-weight: 520; }.hero h1 em { color: var(--accent); font-style: normal; margin-left: 5px; }.hero-intro { max-width: 490px; color: #b0c2ca; font-size: 15px; line-height: 1.95; }.hero-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 11px; margin-top: 25px; color: #9db8c3; font-size: 10px; }.hero-meta span { display: flex; align-items: center; gap: 5px; }.meta-divider { width: 1px; height: 9px; background: #3c5662; }.hero-actions { display: flex; align-items: center; gap: 27px; margin-top: 34px; }.primary-action { display: inline-flex; align-items: center; justify-content: space-between; gap: 25px; min-height: 48px; padding: 0 18px; border: 1px solid #b7f36b; border-radius: 3px; background: #b7f36b; color: #142018; font-size: 12px; }.primary-action:hover { background: #d5ff9d; color: #142018; transform: translateY(-2px); }.text-action { display: flex; align-items: center; gap: 9px; color: #b7cbd3; font-size: 11px; }.availability { display: flex; align-items: center; gap: 8px; margin-top: 27px; color: #a6bdc6; font-size: 9px; letter-spacing: .5px; }.availability span { width: 5px; height: 5px; border-radius: 50%; background: #b7f36b; box-shadow: 0 0 8px #b7f36b88; }.availability b { font-weight: 450; color: #728c99; }
  .hero-flow { position: absolute; right: 60px; top: 50%; width: min(34vw, 390px); transform: translateY(-57%); padding: 22px; border: 1px solid #48616d80; background: #0a1520a8; backdrop-filter: blur(8px); }.flow-topline { display: flex; justify-content: space-between; color: #76929e; font-size: 8px; letter-spacing: 1px; }.flow-stack { display: grid; gap: 9px; margin-top: 26px; }.flow-mini { display: grid; grid-template-columns: 35px 1fr auto; align-items: center; gap: 12px; min-height: 68px; padding: 11px 12px; border: 1px solid #2d4652; background: #0d1a26bf; color: #a5b8c2; }.flow-mini.flow-active { border-color: #759d6d; background: #15292a; }.flow-number { color: var(--accent); font-size: 10px; }.flow-mini strong { display: block; color: #e0ecec; font-size: 13px; font-weight: 500; }.flow-mini small { display: block; margin-top: 5px; color: #86a2ab; font-size: 9px; }.flow-mini :global(svg) { color: #7ba59e; }.flow-note { margin-top: 18px; color: #8ea8b1; font-size: 10px; line-height: 1.7; }
  .hero-footnote { position: absolute; bottom: 36px; left: 68px; right: 68px; display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid #6b87902e; color: #99afb9; font-size: 10px; letter-spacing: .6px; }.hero-footnote a { display: flex; align-items: center; gap: 10px; min-height: 44px; }
  .resume-details { background: rgb(7 11 22 / .9); border-top: 1px solid #263b46; }.detail-section { padding-block: 92px; }.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 45px; margin-bottom: 48px; }.section-heading h2 { margin-top: 20px; color: #e8f4f4; font-size: clamp(29px, 3vw, 43px); line-height: 1.25; letter-spacing: -1.8px; font-weight: 470; }.section-heading h2 span { color: #a8c9c3; }.section-aside { max-width: 240px; padding-bottom: 4px; color: #819ba7; font-size: 10px; line-height: 1.8; text-align: right; }
  .skill-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 13px; }.skill-card { min-height: 292px; padding: 18px 18px 22px; border: 1px solid #273e49; background: #0b1621b8; }.skill-card.skill-primary { border-color: #608b77; background: linear-gradient(155deg, #12302d, #0b1621 70%); }.skill-card-top { display: flex; justify-content: space-between; color: #77949e; font-size: 10px; }.skill-card-top :global(svg) { color: #89b6a7; }.skill-card h3 { margin-top: 33px; color: #e0eeee; font-size: 22px; font-weight: 450; }.skill-card > p { margin-top: 7px; color: #829da7; font-size: 10px; }.skill-card ul { display: flex; flex-wrap: wrap; gap: 7px; margin: 25px 0 0; padding: 0; list-style: none; }.skill-card li { padding: 7px 8px; border: 1px solid #304956; color: #abc2c6; font-size: 9px; }
  .project-section { border-top: 1px solid #253a45; }.horizontal-heading { align-items: end; }.project-feature { display: grid; grid-template-columns: 80px 1fr 280px; gap: 38px; padding-block: 40px; border-top: 1px solid #263e48; }.project-index { color: var(--accent); font-size: 11px; }.project-index span { display: block; margin-top: 12px; color: #78939e; font-size: 8px; letter-spacing: 1px; }.project-type { display: flex; gap: 14px; color: #8da8b2; font-size: 10px; }.project-type span { color: #6d8793; }.project-main h3 { margin-top: 17px; color: #edf7f4; font-size: clamp(26px, 3.2vw, 43px); font-weight: 430; letter-spacing: -1.5px; }.project-description { max-width: 650px; margin-top: 16px; color: #a4bac1; font-size: 14px; line-height: 1.85; }.project-stack { display: flex; gap: 15px; margin-top: 24px; padding: 13px 0; border-block: 1px solid #233a44; color: #a5c9bb; font-size: 11px; line-height: 1.6; }.project-stack span { flex: 0 0 auto; color: #778f9b; font-size: 8px; letter-spacing: 1.3px; }.project-highlights { margin: 19px 0 0; padding-left: 17px; color: #9fb7bf; font-size: 12px; line-height: 1.85; }.project-highlights li::marker { color: #8fbaa4; }.tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }.tag-list span { padding: 6px 8px; color: #96c7b7; background: #16312e; font-size: 9px; }.project-visual { position: relative; min-height: 285px; overflow: hidden; border: 1px solid #365665; background: radial-gradient(circle at 51% 50%, #143e3b 0, #0d1d2a 47%, #09131f 100%); }.visual-grid { position: absolute; inset: 0; opacity: .32; background-image: linear-gradient(#42656c 1px, transparent 1px), linear-gradient(90deg, #42656c 1px, transparent 1px); background-size: 30px 30px; }.visual-orbit { position: absolute; inset: 22%; border: 1px solid #b7f36b99; border-radius: 50%; transform: rotate(-28deg) rotateX(57deg); box-shadow: 0 0 25px #83d2a955, inset 0 0 25px #83d2a944; }.visual-orbit::before { content: ''; position: absolute; inset: 18%; border: 1px solid #b9a6ff99; border-radius: 50%; transform: rotateY(62deg) rotate(40deg); }.project-visual > span { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: #c7f2dc; font-size: 10px; line-height: 1.45; letter-spacing: 1px; text-align: center; }
  .experience-section { border-top: 1px solid #253a45; }.experience-list { border-top: 1px solid #263e48; }.experience-row { display: grid; grid-template-columns: 200px 1fr; gap: 47px; padding-block: 40px; border-bottom: 1px solid #263e48; }.experience-date { display: flex; gap: 10px; align-items: baseline; color: #91aab3; font-size: 10px; }.experience-date b { color: var(--accent); font-weight: 450; }.timeline-dot { width: 6px; height: 6px; margin-right: 4px; border: 1px solid #b7f36b; border-radius: 50%; }.experience-heading { display: flex; justify-content: space-between; align-items: start; gap: 15px; }.experience-heading h3 { color: #e3efef; font-size: 23px; font-weight: 450; }.experience-heading p { margin-top: 7px; color: #9cb8bd; font-size: 12px; }.experience-arrow { display: grid; place-items: center; width: 35px; height: 35px; border: 1px solid #385563; border-radius: 50%; color: #97c0ae; }.experience-description { max-width: 620px; margin-top: 23px; color: #abc0c5; font-size: 14px; line-height: 1.85; }.experience-body ul { margin: 17px 0 0; padding-left: 17px; color: #95aeb6; font-size: 12px; line-height: 1.9; }.experience-body li::marker { color: #7db09c; }
  .delivery-section { padding-block: 78px 90px; border-top: 1px solid #253a45; }.delivery-head { max-width: 550px; }.delivery-head h2 { margin-top: 19px; color: #e8f4f1; font-size: 30px; font-weight: 460; letter-spacing: -1px; }.delivery-head > p:last-child { margin-top: 14px; color: #8ea7b1; font-size: 12px; line-height: 1.8; }.workflow-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; margin-top: 41px; }.workflow-grid article { position: relative; min-height: 210px; padding: 20px; border: 1px solid #2b444e; background: #0c1823b8; }.workflow-icon { display: grid; place-items: center; width: 38px; height: 38px; border: 1px solid #5d8f79; border-radius: 50%; color: #b7f36b; }.workflow-step { display: block; margin-top: 24px; color: #728d99; font-size: 8px; letter-spacing: 1.3px; }.workflow-grid h3 { margin-top: 8px; color: #dcedea; font-size: 18px; font-weight: 470; }.workflow-grid p { margin-top: 12px; color: #92aeb4; font-size: 11px; line-height: 1.75; }
  .education-section { display: grid; grid-template-columns: .75fr 1.6fr; gap: 100px; padding-block: 85px; border-top: 1px solid #253a45; }.education-list { border-top: 1px solid #263e48; }.education-list article { display: grid; grid-template-columns: 1fr auto; gap: 9px 24px; padding-block: 22px; border-bottom: 1px solid #263e48; }.education-list h3 { color: #dfeceb; font-size: 18px; font-weight: 450; }.education-list p { margin-top: 7px; color: #9ab3bb; font-size: 11px; }.education-list article > span { color: #91aeb4; font-size: 10px; }.education-list small { grid-column: 1 / -1; color: #849fa8; font-size: 11px; line-height: 1.75; }
  .contact-section { padding-block: 100px 55px; border-top: 1px solid #253a45; }.contact-heading { display: flex; align-items: center; justify-content: space-between; max-width: 850px; margin-top: 24px; }.contact-heading h2 { color: #edf7f4; font-size: clamp(34px, 4.6vw, 62px); line-height: 1.2; letter-spacing: -3px; font-weight: 440; }.contact-heading h2 span { color: #a8c9c3; }.contact-heading :global(svg) { color: #9bccae; }.contact-description { max-width: 500px; margin-top: 22px; color: #a0b8bf; font-size: 13px; line-height: 1.85; }.contact-list { display: flex; flex-wrap: wrap; align-items: center; gap: 19px; margin-top: 28px; }.contact-list a, .contact-place { display: flex; align-items: center; gap: 9px; min-height: 44px; color: #b5ddd1; font-size: 14px; }.contact-list a { padding-bottom: 6px; border-bottom: 1px solid #4b7f74; }.contact-list a:hover { color: var(--accent); border-color: var(--accent); }.contact-place { color: #9bb2ba; }.copy-contact { display: grid; place-items: center; width: 44px; height: 44px; border: 1px solid #35545a; border-radius: 4px; background: transparent; color: #98c8bc; }.copy-contact:hover { border-color: #80bca8; background: #17332f; }.copy-status { min-height: 20px; margin-top: 9px; color: #8ca8b0; font-size: 10px; }.resume-footer { display: flex; align-items: center; justify-content: space-between; gap: 18px; border-top: 1px solid #243946; padding-block: 25px; color: #819da8; font-size: 9px; }.resume-footer a { display: flex; align-items: center; gap: 8px; min-height: 44px; }
  @media (min-width: 1600px) { .wrap { max-width: 1460px; padding-inline: 80px; }.hero-footnote { left: 80px; right: 80px; }.hero-flow { right: 80px; } }
  @media (max-width: 1100px) { .wrap { padding-inline: 42px; }.hero-flow { right: 42px; width: min(36vw, 340px); }.skill-grid { grid-template-columns: repeat(2, 1fr); }.project-feature { grid-template-columns: 55px 1fr 230px; gap: 24px; }.education-section { gap: 50px; } }
  @media (max-width: 820px) { .wrap { padding-inline: 32px; }.resume-header { grid-template-columns: auto 1fr auto; gap: 18px; }.resume-nav { gap: 18px; }.header-status { font-size: 7px; letter-spacing: .5px; }.hero { align-items: start; padding-top: 65px; }.hero-copy { max-width: 500px; }.hero-flow { right: 32px; top: auto; bottom: 135px; width: 300px; transform: none; }.hero-footnote { left: 32px; right: 32px; }.project-feature { grid-template-columns: 45px 1fr; }.project-visual { display: none; }.experience-row { grid-template-columns: 150px 1fr; gap: 25px; }.education-section { grid-template-columns: 1fr 1.5fr; gap: 32px; } }
  @media (max-width: 620px) { .wrap { padding-inline: 24px; }.resume-header { display: flex; flex-wrap: wrap; gap: 7px; padding-top: 18px; min-height: 106px; }.identity { flex: 1; font-size: 24px; }.identity small { margin-left: 11px; font-size: 7px; letter-spacing: .8px; }.header-status { font-size: 7px; }.resume-nav { width: 100%; justify-content: space-between; gap: 6px; }.resume-nav a { font-size: 10px; }.hero { min-height: 760px; padding-top: 43px; padding-bottom: 215px; }.hero-copy::before { inset: -20px -12px; background: #070b16e3; }.section-kicker { gap: 8px; font-size: 7px; letter-spacing: 1px; }.hero h1 { margin-top: 21px; font-size: clamp(48px, 14vw, 72px); letter-spacing: -3px; }.hero-intro { font-size: 13px; line-height: 1.85; }.hero-meta { gap: 8px; font-size: 9px; }.hero-meta span:nth-last-child(-n+2) { display: none; }.hero-actions { gap: 17px; margin-top: 26px; }.primary-action { min-height: 45px; padding-inline: 13px; gap: 13px; font-size: 10px; }.text-action { font-size: 10px; }.availability { margin-top: 20px; font-size: 7px; }.hero-flow { right: 24px; bottom: 100px; left: 24px; width: auto; padding: 16px; }.flow-topline { font-size: 7px; }.flow-stack { gap: 6px; margin-top: 15px; }.flow-mini { min-height: 51px; grid-template-columns: 27px 1fr auto; padding: 8px; }.flow-mini strong { font-size: 11px; }.flow-mini small { margin-top: 2px; font-size: 8px; }.flow-note { display: none; }.hero-footnote { left: 24px; right: 24px; bottom: 22px; padding-top: 12px; font-size: 8px; }.detail-section { padding-block: 58px; }.section-heading { display: block; margin-bottom: 30px; }.section-heading h2 { margin-top: 15px; font-size: 29px; }.section-aside { max-width: none; margin-top: 14px; font-size: 9px; text-align: left; }.skill-grid { grid-template-columns: 1fr; gap: 10px; }.skill-card { min-height: auto; padding: 17px; }.skill-card h3 { margin-top: 24px; font-size: 20px; }.skill-card ul { margin-top: 18px; }.project-feature { grid-template-columns: 26px 1fr; gap: 15px; padding-block: 27px; }.project-index { font-size: 9px; }.project-index span { margin-top: 10px; font-size: 7px; writing-mode: vertical-rl; }.project-type { display: block; font-size: 8px; line-height: 1.7; }.project-type span { display: block; }.project-main h3 { margin-top: 10px; font-size: 26px; }.project-description { margin-top: 13px; font-size: 13px; }.project-stack { display: block; margin-top: 17px; font-size: 10px; }.project-stack span { display: block; margin-bottom: 4px; }.project-highlights { font-size: 12px; }.experience-row { grid-template-columns: 1fr; gap: 17px; padding-block: 28px; }.experience-date { font-size: 9px; }.experience-heading h3 { font-size: 19px; }.experience-heading p { font-size: 11px; }.experience-description { margin-top: 17px; font-size: 13px; }.experience-body ul { font-size: 12px; }.delivery-section { padding-block: 59px; }.delivery-head h2 { font-size: 27px; }.workflow-grid { grid-template-columns: 1fr; gap: 9px; margin-top: 26px; }.workflow-grid article { min-height: 160px; }.education-section { display: block; padding-block: 59px; }.education-list { margin-top: 30px; }.education-list article { grid-template-columns: 1fr; gap: 7px; }.education-list article > span { grid-row: 1; }.education-list small { grid-column: 1; }.contact-section { padding-block: 65px 35px; }.contact-heading h2 { font-size: 35px; letter-spacing: -1.5px; }.contact-heading :global(svg) { width: 30px; height: 30px; }.contact-description { font-size: 13px; }.contact-list { display: grid; grid-template-columns: 1fr auto; gap: 4px 10px; }.contact-list a, .contact-place { font-size: 13px; }.contact-place { grid-column: 1; }.copy-contact { grid-column: 2; grid-row: 1 / span 2; align-self: center; }.resume-footer { flex-wrap: wrap; font-size: 8px; }.resume-footer span:nth-child(2) { order: 3; width: 100%; line-height: 1.8; }.resume-footer a { margin-left: auto; } }
  @media (prefers-reduced-motion: reduce) { a { transition: none; } }

  /* Reference palette: warm white, ink black and terracotta orange. */
  .resume-shell { --resume-muted: #6e7077; color: #111214; }
  .skip-link { background: #111214; color: #fff; }
  .resume-shell::before { background: linear-gradient(90deg, #faf9f7f2 0%, #faf9f7de 30%, #faf9f766 64%, transparent 90%); }
  .resume-header { background: color-mix(in srgb, #faf9f7 86%, transparent); }
  .identity > span, .hero h1 em, .project-index, .experience-date b { color: #cf4410; }
  .identity b, .hero h1, .section-heading h2, .project-main h3, .experience-heading h3, .delivery-head h2, .education-list h3, .contact-heading h2 { color: #111214; }
  .identity small, .resume-nav a, .header-status, .section-kicker, .hero-meta, .availability, .hero-footnote, .section-aside, .project-type, .project-index span, .experience-date, .experience-heading p, .contact-description, .resume-footer { color: #6e7077; }
  .hero-copy::before { background: linear-gradient(90deg, #faf9f7f0 0%, #faf9f7da 80%, transparent); }
  .accent-line { background: #cf4410; }
  .hero-intro, .project-description, .experience-description { color: #45474d; }
  .hero h1 em { color: #cf4410; }
  .header-status i, .availability span { background: #0b9f6e; box-shadow: 0 0 10px #0b9f6e66; }
  .primary-action { border-color: #111214; background: #111214; color: #fff; border-radius: 999px; }
  .primary-action:hover { background: #cf4410; border-color: #cf4410; color: #fff; }
  .text-action, .contact-list a, .contact-place, .copy-contact { color: #45474d; }
  .text-action:hover, .contact-list a:hover { color: #cf4410; }
  .hero-flow { border-color: #e6e4de; background: #ffffffd9; box-shadow: 0 10px 26px #1d1b1810; }
  .flow-topline, .flow-note { color: #6e7077; }
  .flow-mini small { color: #54565c; }
  .flow-mini { border-color: #e6e4de; background: #f3f2eecc; color: #45474d; }
  .flow-mini.flow-active { border-color: #cf4410; background: #fde9e0; }
  .flow-number { color: #a7350e; }
  .flow-mini strong { color: #111214; }
  .flow-mini :global(svg) { color: #cf4410; }
  .resume-details { background: rgb(250 249 247 / .94); border-top-color: #e6e4de; }
  .section-heading h2 span { color: #cf4410; }
  .skill-card, .workflow-grid article { border-color: #e6e4de; background: #ffffffcc; box-shadow: 0 1px 2px #1d1b180a, 0 8px 24px -12px #1d1b1819; }
  .skill-card.skill-primary { border-color: #e5b39f; background: linear-gradient(155deg, #fde9e0, #ffffff 72%); }
  .skill-card-top, .skill-card > p, .workflow-step { color: #6e7077; }
  .skill-card-top :global(svg), .workflow-icon { color: #cf4410; }
  .skill-card h3, .workflow-grid h3 { color: #111214; }
  .skill-card li { border-color: #e6e4de; color: #45474d; background: #faf9f7; }
  .project-section, .experience-section, .education-section, .contact-section, .delivery-section { border-top-color: #e6e4de; }
  .project-feature, .experience-list, .experience-row, .education-list, .education-list article { border-color: #e6e4de; }
  .project-stack { border-color: #e6e4de; color: #45474d; }
  .project-stack span, .project-highlights, .experience-body ul, .education-list small { color: #6e7077; }
  .project-highlights li::marker, .experience-body li::marker { color: #cf4410; }
  .tag-list span { color: #b83a0e; background: #fde9e0; }
  .project-visual { border-color: #e6e4de; background: radial-gradient(circle at 51% 50%, #fff 0, #f3f2ee 58%, #eceae5 100%); border-radius: 14px; }
  .visual-grid { opacity: .36; background-image: linear-gradient(#d3d0c8 1px, transparent 1px), linear-gradient(90deg, #d3d0c8 1px, transparent 1px); }
  .visual-orbit { border-color: #cf441099; box-shadow: 0 0 25px #cf441022, inset 0 0 25px #cf44101c; }
  .visual-orbit::before { border-color: #11121466; }
  .project-visual > span { color: #b83a0e; }
  .timeline-dot { border-color: #cf4410; }
  .experience-arrow { border-color: #d3d0c8; color: #cf4410; }
  .workflow-icon { border-color: #e5b39f; background: #fde9e0; }
  .contact-heading h2 span { color: #cf4410; }
  .contact-heading :global(svg) { color: #cf4410; }
  .contact-list a { border-color: #e5b39f; }
  .copy-contact { border-color: #d3d0c8; background: #fff; }
  .copy-contact:hover { border-color: #cf4410; background: #fde9e0; }
  .resume-footer { border-top-color: #e6e4de; }

  /* Layout pass inspired by the reference: clear containers, generous rhythm, and a stable hero grid. */
  .resume-header { position: sticky; top: 0; z-index: 5; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); min-height: 82px; border-bottom: 1px solid #e6e4de; backdrop-filter: blur(14px); }
  .resume-nav { justify-self: center; align-items: center; gap: 2px; padding: 4px; border: 1px solid #e6e4de; border-radius: 999px; background: #ffffffaa; }
  .resume-nav a { min-width: 44px; justify-content: center; padding-inline: 14px; border-radius: 999px; color: #45474d; }
  .resume-nav a:hover { background: #fde9e0; color: #cf4410; }
  .hero, .resume-details section[id] { scroll-margin-top: 100px; }
  .header-right { display: flex; align-items: center; justify-self: end; gap: 18px; }
  .header-status { justify-self: auto; }
  .header-contact { display: flex; align-items: center; gap: 5px; min-height: 44px; padding: 0 16px; border-radius: 999px; background: #111214; color: #fff; font-size: 11px; }
  .header-contact:hover { background: #cf4410; color: #fff; transform: translateY(-1px); }
  .text-action { min-height: 44px; padding-block: 10px; }
  .hero { display: grid; grid-template-columns: minmax(0, 1.04fr) minmax(320px, .72fr); grid-template-rows: auto auto 1fr; align-items: center; gap: 22px clamp(42px, 8vw, 132px); padding-top: 78px; }
  .hero-copy { grid-column: 1; grid-row: 1 / span 2; max-width: 680px; }
  .hero h1 > span { display: block; }
  .hero-flow { position: relative; right: auto; top: auto; width: auto; grid-column: 2; grid-row: 1 / span 2; align-self: center; transform: none; border-radius: 18px; padding: 26px; }
  .hero-stats { grid-column: 1; grid-row: 3; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; max-width: 690px; margin-top: 26px; }
  .hero-stats article { display: flex; flex-direction: column; gap: 6px; min-height: 92px; padding: 16px 18px; border: 1px solid #e6e4de; border-radius: 14px; background: #ffffffb8; box-shadow: 0 1px 2px #1d1b180a; }
  .hero-stats strong { color: #111214; font-size: 28px; font-weight: 520; letter-spacing: -1px; }
  .hero-stats span { color: #6e7077; font-size: 10px; }
  .hero-footnote { position: relative; inset: auto; grid-column: 1 / -1; grid-row: 4; margin-top: 42px; }
  .skill-card, .workflow-grid article { border-radius: 18px; }
  .skill-card { min-height: 310px; padding: 24px 22px 25px; }
  .project-feature { margin-top: 14px; padding: 34px 30px; border: 1px solid #e6e4de; border-radius: 18px; background: #ffffffb8; box-shadow: 0 1px 2px #1d1b180a, 0 8px 24px -12px #1d1b1819; }
  .project-feature + .project-feature { margin-top: 12px; }
  .project-visual { border-radius: 14px; }
  .experience-row { padding-block: 32px; }
  .contact-section { margin-top: 16px; padding: 72px 68px 42px; border: 0; border-radius: 24px; background: #111214; }
  .contact-section .section-kicker, .contact-section .contact-description, .contact-section .contact-place, .contact-section .copy-status { color: #a6a7aa; }
  .contact-section .contact-heading h2 { color: #fff; }
  .contact-section .contact-heading h2 span { color: #f17a4e; }
  .contact-section .contact-heading :global(svg) { color: #f17a4e; }
  .contact-section .contact-list a { color: #fff; border-color: #f17a4e; }
  .contact-section .contact-list a:hover { color: #f17a4e; }
  .contact-section .contact-place { color: #bfc0c2; }
  .contact-section .copy-contact { border-color: #4b4d50; background: transparent; color: #fff; }
  .contact-section .copy-contact:hover { border-color: #f17a4e; background: #2a1b16; }

  @media (max-width: 820px) {
    .resume-header { position: relative; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); }
    .header-right { gap: 8px; }
    .header-status { display: none; }
    .hero, .resume-details section[id] { scroll-margin-top: 24px; }
    .hero { display: flex; flex-direction: column; align-items: stretch; gap: 25px; min-height: auto; padding-block: 48px 40px; }
    .hero-copy, .hero-flow, .hero-stats, .hero-footnote { width: 100%; max-width: none; }
    .hero-copy { order: 1; }
    .hero-flow { order: 2; position: relative; inset: auto; transform: none; }
    .hero-stats { order: 3; margin-top: 0; }
    .hero-footnote { order: 4; margin-top: 10px; }
    .education-section { grid-template-columns: minmax(0, 1fr); gap: 32px; }
    .education-section .section-heading { margin-bottom: 0; }
    .contact-section { padding-inline: 32px; }
  }
  @media (max-width: 620px) {
    .resume-shell { padding-bottom: 0; }
    .resume-header { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px 12px; padding-block: 16px 14px; }
    .identity { grid-column: 1; grid-row: 1; align-items: center; }
    .identity small { margin-left: 10px; }
    .header-right { grid-column: 2; grid-row: 1; width: auto; }
    .header-contact { padding-inline: 14px; font-size: 12px; }
    .resume-nav { grid-column: 1 / -1; grid-row: 2; width: auto; gap: 4px; }
    .resume-nav a { padding-inline: 22px; font-size: 12px; }
    .hero { padding-block: 36px 28px; gap: 24px; }
    .hero-intro { font-size: 14px; }
    .section-kicker { font-size: 8px; }
    .hero-meta { font-size: 11px; }
    .hero-actions { flex-wrap: wrap; gap: 12px 20px; margin-top: 24px; }
    .primary-action, .text-action { font-size: 12px; }
    .availability { flex-wrap: wrap; font-size: 10px; line-height: 1.6; }
    .availability b { display: none; }
    .hero-flow { padding: 18px; border-radius: 16px; }
    .flow-topline { flex-wrap: wrap; gap: 6px 12px; font-size: 8px; }
    .flow-mini { min-height: 60px; padding: 10px; }
    .flow-mini strong { font-size: 13px; }
    .flow-mini small { font-size: 10px; }
    .hero-stats { gap: 8px; }
    .hero-stats article { min-height: 78px; padding: 13px 12px; }
    .hero-stats strong { font-size: 23px; }
    .hero-footnote { flex-wrap: wrap; gap: 4px 16px; font-size: 10px; }
    .section-heading h2 { font-size: 27px; letter-spacing: -1px; }
    .horizontal-heading h2 span { display: block; }
    .section-aside { font-size: 11px; }
    .skill-card { min-height: auto; padding: 22px; }
    .skill-card > p, .skill-card li { font-size: 11px; }
    .project-feature { grid-template-columns: minmax(0, 1fr); gap: 16px; padding: 24px 20px; border-radius: 16px; }
    .project-index { display: flex; align-items: center; gap: 8px; font-size: 11px; }
    .project-index span { margin-top: 0; font-size: 9px; writing-mode: horizontal-tb; }
    .project-type { font-size: 11px; }
    .project-stack { font-size: 11px; }
    .project-highlights { font-size: 13px; }
    .experience-date { font-size: 11px; }
    .experience-heading h3 { font-size: 18px; line-height: 1.5; }
    .experience-arrow { flex-shrink: 0; }
    .education-list article > span { font-size: 11px; }
    .contact-section { padding: 54px 24px 30px; border-radius: 18px; }
    .contact-heading h2 { font-size: 32px; }
    .contact-list a { min-width: 0; }
    .contact-list a > span { overflow-wrap: anywhere; }
  }
</style>
