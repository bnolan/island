class DocsController < ApplicationController
  
  def show
    @markup = IO.readlines([RAILS_ROOT, 'doc', params[:path] + '.md'].join('/')).join
    @pages = Dir.glob([RAILS_ROOT, 'doc', 'classes', '*'].join("/")).collect { |x| x.sub(/.+\//,'').sub('.md','') }
    @page = params[:path].sub(/.+\//, '')
  end
  
end
